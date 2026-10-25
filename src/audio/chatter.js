import { audio } from './engine.js';
import { vowelOf } from './formant.js';
import { driveCurve } from './fx.js';

let shaper = null;

/**
 * "Text chatter": one procedural sound per typed character (Undertale / Iron Lung style, but low and rotten).
 * - vowel     -> short low pulse (pitch depends on the letter)
 * - consonant -> band-limited noise click
 * - , . ! ?   -> longer rasp sweeping down
 * - high madness -> occasional impulse crackle
 * Sounds are NOT cut off by the next one, so fast text piles up into a possessed murmur.
 */
export function chatterTick(ch, { base = 70, madness = 0, gain = 0.22 } = {}) {
  if (!audio.ready || ch === ' ' || ch === '\n') return;
  const ctx = audio.ctx, t = ctx.currentTime, dest = audio.bus('voice');
  if (!shaper) { shaper = ctx.createWaveShaper(); shaper.curve = driveCurve(18); shaper.connect(dest); }

  if (/[.,!?;:…]/.test(ch)) {
    const g = audio.noiseBurst({ dest: shaper, when: t, dur: 0.22, type: 'lowpass', freq: 500, q: 4, gain: gain * 1.4 });
    return g;
  }
  const v = vowelOf(ch);
  if (v) {
    const o = ctx.createOscillator(); o.type = Math.random() < 0.5 ? 'square' : 'sawtooth';
    const code = ch.toLowerCase().charCodeAt(0);
    const f = base * (0.8 + (code % 7) * 0.09) * (1 + (Math.random() - 0.5) * 0.12);
    o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 0.7, t + 0.08);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 520 + madness * 500;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    o.connect(lp); lp.connect(g); g.connect(shaper); o.start(t); o.stop(t + 0.11);
  } else {
    audio.noiseBurst({ dest: shaper, when: t, dur: 0.035, type: 'bandpass', freq: 250 + Math.random() * 900, q: 3, gain: gain * 0.9 });
  }
  if (madness > 0.5 && Math.random() < madness * 0.25) {
    audio.noiseBurst({ dest: shaper, when: t + 0.01, dur: 0.012, type: 'highpass', freq: 3000, gain: 0.5 });
  }
}
