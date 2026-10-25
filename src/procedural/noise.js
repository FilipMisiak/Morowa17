import { mulberry32 } from '../core/rng.js';

/** 2D value noise in [0,1]. */
export function makeNoise2D(seed = 1) {
  const rnd = mulberry32(seed);
  const N = 256;
  const perm = new Uint16Array(N * 2);
  const vals = new Float32Array(N);
  for (let i = 0; i < N; i++) { vals[i] = rnd(); perm[i] = i; }
  for (let i = N - 1; i > 0; i--) { const j = (rnd() * (i + 1)) | 0; [perm[i], perm[j]] = [perm[j], perm[i]]; }
  for (let i = 0; i < N; i++) perm[i + N] = perm[i];
  const fade = (t) => t * t * (3 - 2 * t);
  const v = (x, y) => vals[perm[perm[x & 255] + (y & 255)] & 255];
  return (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const u = fade(x - xi), w = fade(y - yi);
    const a = v(xi, yi), b = v(xi + 1, yi), c = v(xi, yi + 1), d = v(xi + 1, yi + 1);
    const top = a + (b - a) * u, bot = c + (d - c) * u;
    return top + (bot - top) * w;
  };
}

export function fbm(noise, x, y, octaves = 4) {
  let amp = 0.5, freq = 1, sum = 0;
  for (let i = 0; i < octaves; i++) { sum += amp * noise(x * freq, y * freq); freq *= 2; amp *= 0.5; }
  return sum;
}
