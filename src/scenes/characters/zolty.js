import { ellipse, roundRect, rgba, drawHead, W } from './draw.js';

/** The man at the door in ep08: black beanie, pale face with deep sockets, bright yellow quilted down jacket, dark jeans. */
export default {
  id: 'zolty',
  height: 1.75,
  face: { w: 62, h: 78, skin: [176, 170, 120], hair: [14, 14, 12], glow: [220, 190, 50], teeth: [220, 210, 170], nose: 0.12, jaw: -0.02, brow: 6, stubble: 60, curly: false, part: false, seed: 57 },
  draw(ctx, p) {
    const cx = W / 2, by = p.bob, walk = p.walk;
    const legSwing = walk === 1 ? 8 : walk === 2 ? -8 : 0;
    for (const s of [-1, 1]) {
      const x = s < 0 ? cx - 56 : cx + 4, sw = s < 0 ? legSwing : -legSwing;
      roundRect(ctx, x, 350 + by, 52, 140 + sw, 9, '#1c2230');
      roundRect(ctx, x - 6, 484 + sw, 64, 22, 9, '#0a0907');
    }
    // quilted yellow jacket: rounded body with horizontal seams
    const body = new Path2D(); body.roundRect(cx - 98, 196 + by, 196, 186, 44);
    ctx.save(); ctx.clip(body);
    ctx.fillStyle = '#c8b81c'; ctx.fillRect(cx - 100, 190 + by, 200, 200);
    ctx.fillStyle = '#8a7c10';
    for (let y = 226; y < 380; y += 30) ctx.fillRect(cx - 100, y + by, 200, 4);
    ctx.restore();
    for (const s of [-1, 1]) {
      const swing = walk ? s * (walk === 1 ? 10 : -10) : 0;
      const arm = new Path2D(); arm.roundRect(cx + s * 104 - 22, 206 + by + swing * 0.3, 44, 170, 20);
      ctx.save(); ctx.clip(arm); ctx.fillStyle = '#c8b81c'; ctx.fillRect(cx + s * 104 - 24, 200 + by, 48, 190);
      ctx.fillStyle = '#8a7c10'; for (let y = 236; y < 380; y += 30) ctx.fillRect(cx + s * 104 - 24, y + by, 48, 4);
      ctx.restore();
      ellipse(ctx, cx + s * 104, 384 + by + swing, 17, 21, rgba([172, 164, 116]));
    }
    drawHead(ctx, this.face, p, cx + p.sway, 118 + by);
    // black beanie pulled over the hair
    ctx.fillStyle = '#0c0c0a'; ctx.beginPath(); ctx.ellipse(cx + p.sway, 76 + by, 62, 40, 0, Math.PI, 0); ctx.fill();
    ctx.fillRect(cx + p.sway - 62, 74 + by, 124, 14);
  },
};
