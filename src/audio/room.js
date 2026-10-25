import { audio } from './engine.js';
import { state, clamp } from '../core/state.js';

/**
 * "Sounds from the player's own room": knocks, scratching, footsteps, breath, a slam. They skip the tape chain (no
 * lowpass, no hiss, no wow) and are panned hard to one side, so they seem to come from behind/next to the listener
 * instead of from the recording. Frequency and loudness grow with madness.
 */
let bus = null, panner = null, nextAt = 8;
const rnd = (a, b) => a + Math.random() * (b - a);

function ensure() {
  if (bus) return true;
  if (!audio.ready) return false;
  const ctx = audio.ctx;
  bus = ctx.createGain(); bus.gain.value = 0.8;
  panner = ctx.createStereoPanner();
  const room = ctx.createDelay(0.2); room.delayTime.value = 0.07; // short "room" slap behind the dry sound
  const fb = ctx.createGain(); fb.gain.value = 0.25;
  const wet = ctx.createGain(); wet.gain.value = 0.35;
  const damp = ctx.createBiquadFilter(); damp.type = 'lowpass'; damp.frequency.value = 2200;
  bus.connect(panner); panner.connect(ctx.destination);
  bus.connect(room); room.connect(damp); damp.connect(fb); fb.connect(room); damp.connect(wet); wet.connect(panner);
  return true;
}

/** A gain node ramping 0 -> peak -> 0, wired to the room bus. */
function env(t, attack, hold, release, peak) {
  const g = audio.ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.setValueAtTime(peak, t + attack + hold);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + hold + release);
  g.connect(bus);
  return g;
}

const noiseSrc = (t, dur, type, freq, q) => {
  const ctx = audio.ctx;
  const src = ctx.createBufferSource(); src.buffer = audio.noise(); src.loop = true;
  const filter = ctx.createBiquadFilter(); filter.type = type; filter.frequency.value = freq; filter.Q.value = q;
  src.connect(filter); src.start(t, rnd(0, 1.5)); src.stop(t + dur + 0.1);
  return { src, filter };
};

/** Dull knock / footfall: pitch-dropping sine plus a short noise click. */
const thump = (t, f0 = 90, gain = 0.8, dur = 0.22) => {
  const ctx = audio.ctx;
  const o = ctx.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * 0.4, t + dur * 0.6);
  o.connect(env(t, 0.004, 0.02, dur, gain)); o.start(t); o.stop(t + dur + 0.1);
  noiseSrc(t, 0.06, 'lowpass', f0 * 8, 0.7).filter.connect(env(t, 0.002, 0.01, 0.05, gain * 0.5));
};

/** Each event schedules itself at `t` and returns its length in seconds. */
const EVENTS = {
  /** knuckles on wood, 2-4 knocks */
  knock(t) { const n = 2 + (Math.random() * 3 | 0); let x = t; for (let i = 0; i < n; i++) { thump(x, rnd(150, 220), 0.9, 0.12); x += rnd(0.25, 0.6); } return x - t; },
  /** something scratching a wall or door: fast stuttering noise */
  scratch(t) {
    const dur = rnd(1.2, 2.4);
    const { filter } = noiseSrc(t, dur, 'bandpass', rnd(2400, 4200), 2.5);
    const g = audio.ctx.createGain(); g.gain.value = 0;
    const lfo = audio.ctx.createOscillator(); lfo.type = 'square'; lfo.frequency.value = rnd(5, 11);
    const lg = audio.ctx.createGain(); lg.gain.value = 0.22;
    lfo.connect(lg); lg.connect(g.gain); lfo.start(t); lfo.stop(t + dur);
    filter.connect(g); g.connect(env(t, 0.05, dur - 0.3, 0.25, 1));
    return dur;
  },
  /** board under a heavy foot */
  creak(t) {
    const dur = rnd(0.8, 1.6), ctx = audio.ctx, f0 = rnd(55, 90);
    const o = ctx.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(f0, t); o.frequency.linearRampToValueAtTime(f0 * rnd(1.4, 2.2), t + dur);
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = rnd(350, 700); f.Q.value = 12;
    o.connect(f); f.connect(env(t, 0.1, dur * 0.5, dur * 0.4, 0.35)); o.start(t); o.stop(t + dur + 0.2);
    return dur;
  },
  /** slow footsteps that cross the room */
  steps(t) {
    const n = 4 + (Math.random() * 3 | 0); let x = t;
    for (let i = 0; i < n; i++) { thump(x, rnd(60, 80), 0.25 + 0.14 * i, 0.3); x += rnd(0.55, 0.8); }
    return x - t;
  },
  /** a breath right next to the ear */
  breath(t) {
    const dur = rnd(1.4, 2.2);
    noiseSrc(t, dur, 'bandpass', rnd(1100, 1700), 1.3).filter.connect(env(t, dur * 0.45, 0.05, dur * 0.5, 0.3));
    return dur;
  },
  /** furniture dragged over the floor above */
  drag(t) {
    const dur = rnd(1.2, 2), { filter } = noiseSrc(t, dur, 'lowpass', 220, 4);
    filter.frequency.linearRampToValueAtTime(rnd(350, 600), t + dur);
    const g = audio.ctx.createGain(); g.gain.value = 0;
    const lfo = audio.ctx.createOscillator(); lfo.frequency.value = rnd(7, 13);
    const lg = audio.ctx.createGain(); lg.gain.value = 0.3;
    lfo.connect(lg); lg.connect(g.gain); lfo.start(t); lfo.stop(t + dur);
    filter.connect(g); g.connect(env(t, 0.1, dur - 0.4, 0.3, 0.9));
    return dur;
  },
  /** door slam / something heavy falling: the rare jump scare */
  slam(t) {
    thump(t, 70, 1, 0.5);
    noiseSrc(t, 0.35, 'lowpass', 900, 0.5).filter.connect(env(t, 0.003, 0.03, 0.3, 0.9));
    return 0.6;
  },
  /** thin high ring that fades in and out */
  ring(t) {
    const ctx = audio.ctx, dur = rnd(2.5, 4);
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = rnd(2300, 3400);
    o.connect(env(t, dur * 0.5, 0, dur * 0.5, 0.05)); o.start(t); o.stop(t + dur + 0.1);
    return dur;
  },
};
// [name, weight, madness needed before it can happen]
const TABLE = [['knock', 3, 0], ['creak', 3, 0], ['scratch', 2, 0.05], ['steps', 2, 0.1], ['breath', 1.5, 0.2], ['drag', 1.5, 0.15], ['ring', 1, 0.3], ['slam', 0.8, 0.12]];

/** Fires one event now (a given name, or a weighted random pick). Also handy from the debug console. */
export function roomSound(name = null) {
  if (!ensure()) return null;
  let pick = name;
  if (!pick) {
    const list = TABLE.filter(([, , from]) => state.madness >= from);
    let r = Math.random() * list.reduce((s, [, w]) => s + w, 0);
    for (const [n, w] of list) { if ((r -= w) <= 0) { pick = n; break; } }
    pick ??= 'knock';
  }
  const t = audio.ctx.currentTime + 0.02;
  const side = Math.random() < 0.5 ? -1 : 1;
  panner.pan.cancelScheduledValues(t);
  panner.pan.setValueAtTime(side * rnd(0.55, 0.95), t);
  bus.gain.setTargetAtTime(0.55 + 0.45 * state.madness, t, 0.05);
  const dur = EVENTS[pick](t);
  if (pick === 'steps') panner.pan.linearRampToValueAtTime(-side * 0.2, t + dur);
  return pick;
}

/** Per-frame scheduler: quiet early in a level, busier as madness grows. */
export function updateRoom(dt) {
  if (!audio.ready || state.level !== 'running') { nextAt = Math.max(nextAt, 8); return; }
  nextAt -= dt;
  if (nextAt > 0) return;
  const m = clamp(state.madness, 0, 1);
  nextAt = rnd(11, 24) * (1 - 0.6 * m);
  roomSound();
  if (Math.random() < 0.15 + 0.25 * m) setTimeout(roomSound, rnd(1500, 4000)); // sometimes a second one follows
}
