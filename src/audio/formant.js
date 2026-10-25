import { audio } from './engine.js';

/** Formant frequencies (F1, F2, F3) per vowel. */
const VOWELS = {
  a: [800, 1150, 2900], e: [400, 1600, 2700], i: [270, 2140, 2950],
  o: [450, 800, 2830],  u: [325, 700, 2700],  y: [375, 1000, 2600],
};
const MAP = { a: 'a', ą: 'o', e: 'e', ę: 'e', i: 'i', o: 'o', ó: 'u', u: 'u', y: 'y' };

export const vowelOf = (ch) => MAP[ch.toLowerCase()] ?? null;

/**
 * One syllable of synthetic "speech": sawtooth glottal source -> 3 parallel bandpass formants
 * (+ breath noise), vibrato and slight pitch glide. Fully procedural. This is the layer that can be
 * pushed through the demon chain, because we generate the audio ourselves.
 */
export function syllable(dest, { vowel = 'a', f0 = 90, dur = 0.14, when, gain = 0.5, glide = 0, vibrato = 5, breath = 0.2 }) {
  const ctx = audio.ctx;
  const t = when ?? ctx.currentTime;
  const osc = ctx.createOscillator(); osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(f0, t);
  if (glide) osc.frequency.linearRampToValueAtTime(f0 * (1 + glide), t + dur);

  const vib = ctx.createOscillator(); vib.frequency.value = vibrato;
  const vg = ctx.createGain(); vg.gain.value = f0 * 0.025;
  vib.connect(vg); vg.connect(osc.frequency);

  const env = ctx.createGain();
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(gain, t + 0.02);
  env.gain.setValueAtTime(gain, t + Math.max(0.03, dur - 0.05));
  env.gain.linearRampToValueAtTime(0, t + dur);
  env.connect(dest);

  const F = VOWELS[vowel] ?? VOWELS.a;
  const weights = [1, 0.55, 0.25];
  F.forEach((freq, i) => {
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass';
    bp.frequency.value = freq * (0.96 + Math.random() * 0.08); bp.Q.value = 9;
    const g = ctx.createGain(); g.gain.value = weights[i];
    osc.connect(bp); bp.connect(g); g.connect(env);
    if (i === 1 && breath > 0) {
      const n = ctx.createBufferSource(); n.buffer = audio.noise();
      const ng = ctx.createGain(); ng.gain.value = breath;
      n.connect(ng); ng.connect(bp); // breath noise excites the same formant
      n.start(t, Math.random() * 1.5); n.stop(t + dur + 0.05);
    }
  });

  osc.start(t); vib.start(t);
  osc.stop(t + dur + 0.05); vib.stop(t + dur + 0.05);
}

/**
 * Schedules a "mumbled" rendition of `text`, one syllable per vowel letter, aligned to the typewriter
 * (charInterval seconds per character). Returns total duration in seconds.
 */
export function mumble(dest, text, { f0 = 90, charInterval = 0.055, gain = 0.5, start, pitchJitter = 0.12, glide = -0.08 } = {}) {
  const ctx = audio.ctx;
  const t0 = start ?? ctx.currentTime + 0.02;
  [...text].forEach((ch, i) => {
    const v = vowelOf(ch);
    if (!v) return;
    const when = t0 + i * charInterval;
    const f = f0 * (1 + (Math.random() - 0.5) * pitchJitter * 2);
    syllable(dest, { vowel: v, f0: f, dur: Math.max(0.09, charInterval * 2.2), when, gain, glide });
  });
  return text.length * charInterval;
}
