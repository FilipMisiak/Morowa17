import { mulberry32 } from '../../core/rng.js';

// Shared 2D drawing helpers for the character sprites. All coordinates are in a 320x512 logical canvas.
export const W = 320, H = 512;

export const rgba = (c, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const shade = (c, k) => c.map((v) => Math.max(0, Math.min(255, Math.round(v * k))));

export function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
}

export function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill();
}

/** Dark speckle (stubble / grain) inside an ellipse; deterministic. */
export function speckle(ctx, seed, cx, cy, rx, ry, n, color) {
  const r = mulberry32(seed);
  ctx.fillStyle = color;
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r());
    ctx.fillRect(cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d, 2, 2);
  }
}

/** Viseme (mouth shape) for a typed character: 0 closed, 1 small, 2 wide, 3 round. */
export function visemeOf(ch) {
  const c = ch.toLowerCase();
  if ('aąä'.includes(c)) return 2;
  if ('eęiy'.includes(c)) return 1;
  if ('ouó'.includes(c)) return 3;
  if ('bmp'.includes(c)) return 0;
  if (/[a-zćłńśźż]/.test(c)) return 1;
  return 0;
}

/**
 * Draws the head (made-up "horror" face: dark eye sockets with glowing pupils, deep creases) centred at (cx, cy).
 * f = face definition of a character, p = pose { viseme, blink, gaze, mad, brow }.
 */
export function drawHead(ctx, f, p, cx, cy) {
  const w = f.w, h = f.h;
  // ears
  for (const s of [-1, 1]) {
    ellipse(ctx, cx + s * w * 0.98, cy + h * 0.05, w * 0.16, h * 0.2, rgba(shade(f.skin, 0.85)));
    ellipse(ctx, cx + s * w * 0.98, cy + h * 0.06, w * 0.08, h * 0.12, rgba(shade(f.skin, 0.6)));
  }
  // neck
  ctx.fillStyle = rgba(shade(f.skin, 0.7));
  ctx.fillRect(cx - w * 0.55, cy + h * 0.6, w * 1.1, h * 0.6);
  // skull / face with a top-lit gradient; madness greens the skin
  const g = ctx.createRadialGradient(cx - w * 0.2, cy - h * 0.4, w * 0.1, cx, cy, h * 1.1);
  const tint = [f.skin[0] * (1 - p.mad * 0.2), f.skin[1], f.skin[2] * (1 - p.mad * 0.15)];
  g.addColorStop(0, rgba(shade(tint, 1.15))); g.addColorStop(0.7, rgba(tint)); g.addColorStop(1, rgba(shade(tint, 0.55)));
  ctx.beginPath(); ctx.ellipse(cx, cy, w, h, 0, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
  // jaw weight (heavy lower face)
  ctx.beginPath(); ctx.ellipse(cx, cy + h * 0.35, w * (0.92 + f.jaw), h * 0.62, 0, 0, Math.PI); ctx.fillStyle = rgba(shade(tint, 0.9)); ctx.fill();
  if (f.stubble) speckle(ctx, f.seed, cx, cy + h * 0.45, w * 0.85, h * 0.5, f.stubble, 'rgba(10,10,6,.55)');

  // hair
  const r = mulberry32(f.seed + 5);
  ctx.fillStyle = rgba(f.hair);
  ctx.beginPath(); ctx.ellipse(cx, cy - h * 0.55, w * 1.02, h * 0.55, 0, Math.PI, 0); ctx.fill();
  const bumps = f.curly ? 16 : 8;
  for (let i = 0; i < bumps; i++) {
    const a = Math.PI + (i / (bumps - 1)) * Math.PI;
    ellipse(ctx, cx + Math.cos(a) * w * 1.0, cy - h * 0.45 + Math.sin(a) * h * 0.62, w * (0.1 + r() * 0.07), h * 0.1, rgba(f.hair));
  }
  if (f.part) { ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - w * 0.3, cy - h * 0.95); ctx.lineTo(cx - w * 0.15, cy - h * 0.45); ctx.stroke(); }

  // creases: forehead, between brows, nasolabial folds
  ctx.strokeStyle = 'rgba(15,12,6,.5)'; ctx.lineWidth = 2.5;
  for (let i = 0; i < 3; i++) {
    const y = cy - h * (0.5 - i * 0.09);
    ctx.beginPath(); ctx.moveTo(cx - w * 0.55, y); ctx.quadraticCurveTo(cx, y - 7 - p.brow * 6, cx + w * 0.55, y); ctx.stroke();
  }
  for (const s of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(cx + s * w * 0.1, cy - h * 0.26); ctx.lineTo(cx + s * w * 0.08, cy - h * 0.1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + s * w * 0.28, cy + h * 0.2); ctx.quadraticCurveTo(cx + s * w * 0.5, cy + h * 0.4, cx + s * w * 0.42, cy + h * 0.62); ctx.stroke();
  }

  // eyes: black sockets, glowing pupils (the made-up look from the tape)
  const ey = cy - h * 0.12, ex = w * 0.36;
  for (const s of [-1, 1]) {
    if (p.blink) {
      ctx.fillStyle = 'rgba(8,6,4,.9)'; ctx.fillRect(cx + s * ex - w * 0.22, ey - 2, w * 0.44, 5);
    } else {
      ellipse(ctx, cx + s * ex, ey + 2, w * 0.27, h * 0.16, 'rgba(3,3,2,.98)');
      ellipse(ctx, cx + s * ex, ey + h * 0.1, w * 0.2, h * 0.07, 'rgba(10,8,4,.55)');
      const gx = cx + s * ex + p.gaze * w * 0.08, gl = f.glow;
      const halo = ctx.createRadialGradient(gx, ey, 0, gx, ey, w * (0.1 + p.mad * 0.1));
      halo.addColorStop(0, rgba(gl, 0.95)); halo.addColorStop(0.35, rgba(gl, 0.45)); halo.addColorStop(1, rgba(gl, 0));
      ctx.fillStyle = halo; ctx.fillRect(gx - w * 0.3, ey - w * 0.3, w * 0.6, w * 0.6);
      ellipse(ctx, gx, ey, 3.2, 3.2, rgba(shade(gl, 1.25)));
    }
    // brows (heavy, slanted by anger)
    ctx.strokeStyle = rgba(shade(f.hair, 0.9)); ctx.lineWidth = f.brow;
    ctx.beginPath();
    ctx.moveTo(cx + s * (ex + w * 0.3), ey - h * 0.2 + p.brow * -4);
    ctx.lineTo(cx + s * (ex - w * 0.22), ey - h * 0.2 + 5 + p.brow * 8);
    ctx.stroke();
  }
  // makeup streak under one eye
  if (f.streak) { ctx.strokeStyle = 'rgba(200,205,185,.55)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx - ex - 4, ey + h * 0.1); ctx.quadraticCurveTo(cx - ex - 10, ey + h * 0.3, cx - ex + 2, ey + h * 0.5); ctx.stroke(); }

  // nose
  ctx.fillStyle = rgba(shade(tint, 0.75));
  ctx.beginPath(); ctx.moveTo(cx, ey + h * 0.02); ctx.lineTo(cx - w * f.nose, cy + h * 0.28); ctx.lineTo(cx + w * f.nose, cy + h * 0.28); ctx.closePath(); ctx.fill();
  ellipse(ctx, cx - w * f.nose * 0.55, cy + h * 0.29, 5, 3.5, 'rgba(8,6,3,.85)');
  ellipse(ctx, cx + w * f.nose * 0.55, cy + h * 0.29, 5, 3.5, 'rgba(8,6,3,.85)');

  // mouth
  const my = cy + h * 0.5, mw = w * 0.34;
  ctx.fillStyle = 'rgba(12,6,4,.95)';
  if (p.viseme === 0) {
    ctx.strokeStyle = 'rgba(14,6,4,.95)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx - mw, my + 2); ctx.quadraticCurveTo(cx, my - 1, cx + mw, my + 4); ctx.stroke();
  } else {
    const open = [0, 0.07, 0.15, 0.12][p.viseme], wid = [1, 0.8, 1, 0.5][p.viseme];
    ctx.beginPath(); ctx.ellipse(cx, my + open * h * 0.5, mw * wid, Math.max(3, open * h), 0, 0, Math.PI * 2); ctx.fill();
    if (p.viseme === 2 || p.viseme === 1) { ctx.fillStyle = rgba(f.teeth); ctx.fillRect(cx - mw * wid * 0.7, my - 1 + open * h * 0.5 - open * h * 0.8, mw * wid * 1.4, 5); }
    ctx.strokeStyle = rgba(shade(f.skin, 0.4)); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(cx, my + open * h * 0.5, mw * wid + 2, Math.max(3, open * h) + 2, 0, 0, Math.PI * 2); ctx.stroke();
  }
}
