import * as THREE from 'three';
import { makeNoise2D, fbm } from './noise.js';
import { mulberry32 } from '../core/rng.js';

function finish(canvas, repeat = [1, 1]) {
  const t = new THREE.CanvasTexture(canvas);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestFilter;
  t.generateMipmaps = false;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Builds a small pixel texture from a per-pixel function (x, y) -> [r, g, b] (0..255). */
function pixelTexture(size, fn, repeat = [1, 1]) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const [r, g, b] = fn(x, y);
      const i = (y * size + x) * 4;
      img.data[i] = r; img.data[i + 1] = g; img.data[i + 2] = b; img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return finish(c, repeat);
}

const mix = (a, b, t) => a + (b - a) * t;
const mix3 = (a, b, t) => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];

/** Dark rotten wooden planks. */
export function woodTexture({ seed = 7, planks = 4, size = 128, repeat = [1, 1], dark = [28, 20, 12], light = [92, 66, 38] } = {}) {
  const n = makeNoise2D(seed);
  return pixelTexture(size, (x, y) => {
    const p = Math.floor((x / size) * planks);
    const grain = fbm(n, x * 0.03 + p * 17, y * 0.35, 4);
    const rot = fbm(n, x * 0.08 + 50, y * 0.08 + 50, 3);
    let c = mix3(dark, light, grain);
    c = mix3(c, [40, 52, 22], Math.max(0, rot - 0.55) * 1.6);          // rotten green patches
    if (((x / size) * planks) % 1 < 0.04) c = mix3(c, [6, 4, 3], 0.8); // plank seams
    return c;
  }, repeat);
}

/** Stained plaster / wallpaper. */
export function plasterTexture({ seed = 11, size = 128, repeat = [1, 1], base = [88, 80, 54] } = {}) {
  const n = makeNoise2D(seed);
  return pixelTexture(size, (x, y) => {
    const g = fbm(n, x * 0.05, y * 0.05, 5);
    const stain = fbm(n, x * 0.02 + 9, y * 0.04 + 3, 3);
    let c = mix3([base[0] * 0.35, base[1] * 0.35, base[2] * 0.3], base, g);
    c = mix3(c, [70, 38, 20], Math.max(0, stain - 0.52) * 2.2);        // rust-brown water stains
    return c;
  }, repeat);
}

export function rustTexture({ seed = 3, size = 64 } = {}) {
  const n = makeNoise2D(seed);
  return pixelTexture(size, (x, y) => mix3([30, 22, 18], [120, 60, 28], fbm(n, x * 0.12, y * 0.12, 4)));
}

/** Sheet of paper; call .write(text) to add typed text (typewriter minigame). */
export function paperSheet({ size = 256 } = {}) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const rnd = mulberry32(5);
  const n = makeNoise2D(5);
  ctx.fillStyle = '#b9ab82';
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 900; i++) {
    const x = rnd() * size, y = rnd() * size, v = fbm(n, x * 0.04, y * 0.04, 3);
    ctx.fillStyle = `rgba(${60 + v * 50},${40 + v * 30},20,0.08)`;
    ctx.fillRect(x, y, 3, 3);
  }
  const tex = finish(c);
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  let line = 0;
  const blank = ctx.getImageData(0, 0, size, size);
  return {
    texture: tex,
    /** Repaints the blank sheet with `text` (typewriter minigame shows progress this way). */
    typed(text) { ctx.putImageData(blank, 0, 0); line = 0; this.write(text); },
    write(text) {
      ctx.fillStyle = '#1b1510';
      ctx.font = '11px monospace';
      const maxChars = 34;
      for (let i = 0; i < text.length; i += maxChars) {
        ctx.fillText(text.slice(i, i + maxChars), 14, 24 + line * 14);
        line = (line + 1) % 16;
      }
      tex.needsUpdate = true;
    },
  };
}
