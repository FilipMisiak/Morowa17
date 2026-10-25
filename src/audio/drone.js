import { audio } from './engine.js';
import { state } from '../core/state.js';

let drone = null;

/** Starts the constant oppressive bed: sub-bass beating pair + filtered wind + dissonant high partial. */
export function startDrone() {
  if (drone || !audio.ready) return;
  const ctx = audio.ctx, dest = audio.bus('ambient');

  const o1 = ctx.createOscillator(); o1.type = 'sine'; o1.frequency.value = 38;
  const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = 39.4; // slow beating
  const o3 = ctx.createOscillator(); o3.type = 'triangle'; o3.frequency.value = 76.9;
  const sub = ctx.createGain(); sub.gain.value = 0.35;
  o1.connect(sub); o2.connect(sub); o3.connect(sub); sub.connect(dest);

  const wind = ctx.createBufferSource(); wind.buffer = audio.noise(); wind.loop = true;
  const wf = ctx.createBiquadFilter(); wf.type = 'lowpass'; wf.frequency.value = 280; wf.Q.value = 3;
  const wg = ctx.createGain(); wg.gain.value = 0.12;
  const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07;
  const lfoG = ctx.createGain(); lfoG.gain.value = 140;
  lfo.connect(lfoG); lfoG.connect(wf.frequency);
  wind.connect(wf); wf.connect(wg); wg.connect(dest);

  const hi = ctx.createOscillator(); hi.type = 'sine'; hi.frequency.value = 1317; // uneasy microtonal whine
  const hg = ctx.createGain(); hg.gain.value = 0;
  hi.connect(hg); hg.connect(dest);

  [o1, o2, o3, wind, lfo, hi].forEach((n) => n.start());
  drone = { o1, o2, o3, wf, wg, hi, hg, sub };
}

/** Call every frame with state.madness: pitch sags, whine rises, wind opens up. */
export function updateDrone() {
  if (!drone) return;
  const t = audio.ctx.currentTime, m = state.madness;
  drone.o1.frequency.setTargetAtTime(38 - 6 * m, t, 0.5);
  drone.o2.frequency.setTargetAtTime(39.4 - 6 * m + 3 * m, t, 0.5);
  drone.hi.frequency.setTargetAtTime(1317 + 220 * m, t, 0.5);
  drone.hg.gain.setTargetAtTime(0.002 + 0.02 * m * m, t, 0.5);
  drone.wg.gain.setTargetAtTime(0.12 + 0.2 * m, t, 0.5);
}

/** One-shot diegetic sounds. Raw, loud, unmuffled, as in the original. */
export const sfx = {
  /** n knocks from the attic: low wooden thumps. */
  knock(n = 3) {
    if (!audio.ready) return;
    const ctx = audio.ctx;
    let t = ctx.currentTime + 0.05;
    for (let i = 0; i < n; i++) {
      const o = ctx.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(95, t); o.frequency.exponentialRampToValueAtTime(38, t + 0.12);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      o.connect(g); g.connect(audio.bus('sfx')); o.start(t); o.stop(t + 0.25);
      audio.noiseBurst({ when: t, dur: 0.05, freq: 700, q: 0.8, gain: 0.35 });
      t += 0.22 + Math.random() * 0.5;
    }
  },
  /** creaking board: filtered saw glide + noise. */
  creak(dur = 0.7) {
    if (!audio.ready) return;
    const ctx = audio.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(70 + Math.random() * 40, t);
    o.frequency.linearRampToValueAtTime(120 + Math.random() * 80, t + dur);
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 500; f.Q.value = 9;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.18, t + 0.08); g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(f); f.connect(g); g.connect(audio.bus('sfx')); o.start(t); o.stop(t + dur + 0.05);
  },
  /** camera cut / tracking glitch: short noise burst + dropout. */
  cut() {
    if (!audio.ready) return;
    const t = audio.ctx.currentTime;
    audio.noiseBurst({ when: t, dur: 0.14, type: 'bandpass', freq: 2400, q: 0.6, gain: 0.35 });
    audio.noiseBurst({ when: t + 0.02, dur: 0.2, type: 'lowpass', freq: 300, gain: 0.3 });
  },
  /** metal bowl clatter (the Współlokator's leitmotif): resonant clicks. */
  bowl(n = 4) {
    if (!audio.ready) return;
    const ctx = audio.ctx;
    let t = ctx.currentTime + 0.02;
    for (let i = 0; i < n; i++) {
      for (const f of [820, 1370, 2110]) {
        const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = f * (0.97 + Math.random() * 0.06);
        const g = ctx.createGain(); g.gain.setValueAtTime(0.08, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
        o.connect(g); g.connect(audio.bus('sfx')); o.start(t); o.stop(t + 0.1);
      }
      t += 0.09 + Math.random() * 0.12;
    }
  },
  /** hard cut to total silence for `ms` (ducks all buses). */
  silence(ms = 1200) {
    if (!audio.ready) return;
    const t = audio.ctx.currentTime;
    for (const b of ['ambient', 'voice', 'sfx']) {
      const g = audio.bus(b).gain;
      const keep = g.value;
      g.cancelScheduledValues(t); g.setValueAtTime(0, t); g.setValueAtTime(keep, t + ms / 1000);
    }
  },
};
