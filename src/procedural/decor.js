import * as THREE from 'three';
import { mulberry32 } from '../core/rng.js';

/** Canvas 2D textures for the recognisable props of the house (see lore/*.md "Wygląd"). Small, nearest-neighbour. */
function tex(w, h, draw, repeat = [1, 1]) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  draw(ctx, w, h);
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter; t.generateMipmaps = false;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function grain(ctx, w, h, seed, n, alpha = 0.18) {
  const r = mulberry32(seed);
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = r() < 0.5 ? `rgba(0,0,0,${alpha})` : `rgba(255,240,180,${alpha * 0.6})`;
    ctx.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2);
  }
}

/** Olive-yellow plaster with a green painted dado ("lamperia") in the lower part, stains and cracks. */
export function dadoWall(seed = 3) {
  return tex(256, 128, (ctx, w, h) => {
    ctx.fillStyle = '#8f8a46'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#3e6a35'; ctx.fillRect(0, h * 0.58, w, h * 0.42);
    ctx.fillStyle = '#d4cf8c'; ctx.fillRect(0, h * 0.58 - 2, w, 3);          // trim line
    grain(ctx, w, h, seed, 1400);
    const r = mulberry32(seed + 9);
    ctx.fillStyle = 'rgba(60,40,12,.22)';
    for (let i = 0; i < 6; i++) ctx.fillRect(r() * w, 0, 5 + r() * 14, 20 + r() * 60); // damp streaks
    ctx.strokeStyle = 'rgba(20,15,6,.5)'; ctx.lineWidth = 1;
    ctx.beginPath(); let x = r() * w, y = 0; ctx.moveTo(x, y);
    for (let i = 0; i < 8; i++) { x += (r() - 0.5) * 14; y += 8 + r() * 6; ctx.lineTo(x, y); } ctx.stroke();
  });
}

export function brickTexture(repeat = [2, 2]) {
  return tex(128, 128, (ctx, w, h) => {
    ctx.fillStyle = '#26301c'; ctx.fillRect(0, 0, w, h);
    const bh = 16, bw = 32, r = mulberry32(5);
    for (let row = 0; row < h / bh; row++) {
      for (let col = -1; col < w / bw + 1; col++) {
        const x = col * bw + (row % 2 ? bw / 2 : 0), g = 90 + r() * 40;
        ctx.fillStyle = `rgb(${g * 0.78},${g * 0.9},${g * 0.45})`;
        ctx.fillRect(x + 2, row * bh + 2, bw - 3, bh - 3);
      }
    }
    grain(ctx, w, h, 7, 500);
  }, repeat);
}

/** Green tablecloth with orange/red flowers (jadalnia, ep09). */
export function flowerCloth() {
  return tex(128, 128, (ctx, w, h) => {
    ctx.fillStyle = '#3d5a2a'; ctx.fillRect(0, 0, w, h);
    const r = mulberry32(12);
    for (let i = 0; i < 26; i++) {
      const x = r() * w, y = r() * h;
      ctx.fillStyle = r() < 0.5 ? '#c4622a' : '#a82a22';
      for (let k = 0; k < 5; k++) { const a = (k / 5) * Math.PI * 2; ctx.beginPath(); ctx.arc(x + Math.cos(a) * 5, y + Math.sin(a) * 5, 3.2, 0, 7); ctx.fill(); }
      ctx.fillStyle = '#e8c860'; ctx.beginPath(); ctx.arc(x, y, 2.2, 0, 7); ctx.fill();
    }
    grain(ctx, w, h, 4, 400, 0.12);
  });
}

export function checkCloth() {
  return tex(64, 64, (ctx, w, h) => {
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { ctx.fillStyle = (x + y) % 2 ? '#d8d6c2' : '#1a1a14'; ctx.fillRect(x * 8, y * 8, 8, 8); }
    grain(ctx, w, h, 2, 200, 0.1);
  });
}

/** Black stripes on olive: the zebra-print blanket on the sofa (ep04). */
export function zebraFabric() {
  return tex(128, 128, (ctx, w, h) => {
    ctx.fillStyle = '#7e8048'; ctx.fillRect(0, 0, w, h);
    const r = mulberry32(21); ctx.strokeStyle = '#14130c'; ctx.lineCap = 'round';
    for (let i = 0; i < 38; i++) {
      ctx.lineWidth = 2 + r() * 4; const x = r() * w, y = r() * h;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 10 + r() * 10, y + 10, x + 4 + r() * 20, y + 22 + r() * 14); ctx.stroke();
    }
  });
}

/** A framed picture: dark scene with a blurry figure. `kind` = 'portrait' | 'landscape'. */
export function pictureTexture(kind = 'portrait', seed = 1) {
  return tex(64, 80, (ctx, w, h) => {
    ctx.fillStyle = '#2a2a1c'; ctx.fillRect(0, 0, w, h);
    const r = mulberry32(seed);
    if (kind === 'portrait') {
      ctx.fillStyle = '#6a6a48'; ctx.beginPath(); ctx.ellipse(w / 2, h * 0.4, 14, 18, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#16140e'; ctx.fillRect(w / 2 - 22, h * 0.62, 44, 30);
    } else {
      ctx.fillStyle = '#4b6b40'; ctx.fillRect(0, h * 0.5, w, h * 0.5);
      ctx.fillStyle = '#7d8a6a'; ctx.fillRect(0, 0, w, h * 0.5);
      for (let i = 0; i < 6; i++) { ctx.fillStyle = '#1e2a16'; ctx.fillRect(r() * w, h * 0.35, 3, 18 + r() * 10); }
    }
    grain(ctx, w, h, seed, 140, 0.25);
  });
}

/** Typewriter keyboard top: rows of round keys. */
export function keysTexture() {
  return tex(64, 32, (ctx, w, h) => {
    ctx.fillStyle = '#1c1a14'; ctx.fillRect(0, 0, w, h);
    for (let row = 0; row < 4; row++) for (let i = 0; i < 11 - (row === 3 ? 3 : 0); i++) {
      ctx.fillStyle = '#d2cdb0'; ctx.beginPath(); ctx.arc(5 + i * 5.2 + row * 1.4, 4 + row * 7, 2.1, 0, 7); ctx.fill();
      ctx.fillStyle = '#2a2820'; ctx.fillRect(3 + i * 5.2 + row * 1.4, 4 + row * 7, 4, 1);
    }
  });
}

/** Window curtains: vertical yellow-brown stripes. */
export function curtainTexture() {
  return tex(64, 64, (ctx, w, h) => {
    for (let x = 0; x < w; x += 8) { ctx.fillStyle = (x / 8) % 2 ? '#8a6a30' : '#a58a48'; ctx.fillRect(x, 0, 8, h); }
    grain(ctx, w, h, 8, 150, 0.15);
  });
}

/** Door with small panes in the upper half (ep12, ep18 frames): returns a texture with transparent-dark panes. */
export function doorTexture() {
  return tex(64, 128, (ctx, w, h) => {
    ctx.fillStyle = '#8a4a22'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#10100a';
    for (let i = 0; i < 3; i++) ctx.fillRect(8 + i * 17, 10, 14, 30);
    ctx.strokeStyle = '#5a2e12'; ctx.lineWidth = 3;
    ctx.strokeRect(6, 56, 52, 30); ctx.strokeRect(6, 90, 52, 32);
    grain(ctx, w, h, 15, 300, 0.25);
  });
}

/** Jars of preserves on a shelf: rows of green-yellow glass. */
export function jarsTexture() {
  return tex(128, 32, (ctx, w, h) => {
    ctx.fillStyle = '#1a150c'; ctx.fillRect(0, 0, w, h);
    const r = mulberry32(31);
    for (let i = 0; i < 9; i++) {
      const x = 4 + i * 14, g = r();
      ctx.fillStyle = g < 0.5 ? '#9aa046' : '#b8782e'; ctx.fillRect(x, 6, 11, 22);
      ctx.fillStyle = '#d8d6b0'; ctx.fillRect(x, 3, 11, 4);
      ctx.fillStyle = 'rgba(255,255,220,.35)'; ctx.fillRect(x + 2, 9, 2, 14);
    }
  });
}
