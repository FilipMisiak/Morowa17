import { ellipse, roundRect, rgba, drawHead, W } from './draw.js';

/** The visitor ("pan", ep06): dark short hair, grey stubble, wide grin, black zip jacket with yellow piping, a thin chain and green-blue beads. */
export default {
  id: 'gosc',
  height: 1.78,
  face: { w: 64, h: 80, skin: [158, 150, 124], hair: [22, 18, 14], glow: [230, 200, 60], teeth: [214, 204, 168], nose: 0.14, jaw: 0.02, brow: 4, stubble: 130, curly: false, part: true, seed: 41 },
  draw(ctx, p) {
    const cx = W / 2, by = p.bob, walk = p.walk;
    const legSwing = walk === 1 ? 8 : walk === 2 ? -8 : 0;
    for (const s of [-1, 1]) {
      const x = s < 0 ? cx - 56 : cx + 4, sw = s < 0 ? legSwing : -legSwing;
      roundRect(ctx, x, 350 + by, 52, 140 + sw, 9, '#15140f');
      roundRect(ctx, x - 6, 484 + sw, 64, 22, 9, '#0a0907');
    }
    // black jacket with yellow piping along the zip and the cuffs
    roundRect(ctx, cx - 92, 198 + by, 184, 180, 38, '#0e0e0b');
    ctx.fillStyle = '#c8b030'; ctx.fillRect(cx - 2, 214 + by, 4, 164);
    ctx.fillRect(cx - 86, 232 + by, 40, 3); ctx.fillRect(cx + 46, 232 + by, 40, 3);
    for (const s of [-1, 1]) {
      const swing = walk ? s * (walk === 1 ? 10 : -10) : 0;
      roundRect(ctx, cx + s * 100 - 20, 208 + by + swing * 0.3, 40, 170, 18, '#0e0e0b');
      ctx.fillStyle = '#c8b030'; ctx.fillRect(cx + s * 100 - 20, 366 + by + swing * 0.3, 40, 4);
      ellipse(ctx, cx + s * 100, 384 + by + swing, 17, 21, rgba([150, 142, 116]));
    }
    // chain and beads on the neck, small badge on the chest
    ctx.strokeStyle = '#a8a89a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, 206 + by, 30, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    for (let i = 0; i < 5; i++) ellipse(ctx, cx - 18 + i * 9, 236 + by + Math.abs(i - 2) * -2, 4, 4, '#3a8a86');
    roundRect(ctx, cx + 40, 258 + by, 18, 14, 3, '#d8c030');
    drawHead(ctx, this.face, p, cx + p.sway, 118 + by);
  },
};
