import { ellipse, roundRect, rgba, drawHead, W } from './draw.js';

/** Major ("wojtek"): leaner, short dark curly hair, red glowing eyes (ep01 frames), black sweater with yellow-green stripes and a white polo collar, black tracksuit trousers. */
export default {
  id: 'major',
  height: 1.7,
  face: { w: 60, h: 80, skin: [148, 152, 120], hair: [16, 14, 12], glow: [235, 40, 45], teeth: [200, 190, 150], nose: 0.13, jaw: -0.04, brow: 7, stubble: 90, curly: true, part: false, streak: true, seed: 23 },
  draw(ctx, p) {
    const cx = W / 2, by = p.bob, walk = p.walk;
    const legSwing = walk === 1 ? 8 : walk === 2 ? -8 : 0;
    // tracksuit trousers with a white side stripe
    for (const s of [-1, 1]) {
      const x = s < 0 ? cx - 56 : cx + 4, sw = s < 0 ? legSwing : -legSwing;
      roundRect(ctx, x, 350 + by, 52, 140 + sw, 9, '#14130f');
      ctx.fillStyle = '#d9d6c4'; ctx.fillRect(x + (s < 0 ? 3 : 46), 352 + by, 3, 136 + sw);
      roundRect(ctx, x - 6, 484 + sw, 64, 22, 9, '#0a0907');
    }
    // torso + horizontal stripes (clipped to body)
    const body = new Path2D(); body.roundRect(cx - 92, 198 + by, 184, 180, 38);
    ctx.save(); ctx.clip(body);
    ctx.fillStyle = '#16150f'; ctx.fillRect(cx - 100, 190 + by, 200, 200);
    ctx.fillStyle = '#a9a64a';
    for (let y = 204; y < 380; y += 17) ctx.fillRect(cx - 100, y + by, 200, 5);
    ctx.restore();
    // arms (same stripes)
    for (const s of [-1, 1]) {
      const swing = walk ? s * (walk === 1 ? 10 : -10) : 0;
      const arm = new Path2D(); arm.roundRect(cx + s * 100 - 20, 208 + by + swing * 0.3, 40, 170, 18);
      ctx.save(); ctx.clip(arm); ctx.fillStyle = '#16150f'; ctx.fillRect(cx + s * 100 - 22, 200 + by, 44, 190);
      ctx.fillStyle = '#a9a64a'; for (let y = 214; y < 380; y += 17) ctx.fillRect(cx + s * 100 - 22, y + by, 44, 5);
      ctx.restore();
      ellipse(ctx, cx + s * 100, 384 + by + swing, 17, 21, rgba([140, 144, 112]));
    }
    // white polo collar
    ctx.fillStyle = '#d8d6c6';
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(cx, 206 + by); ctx.lineTo(cx + s * 44, 200 + by); ctx.lineTo(cx + s * 26, 244 + by); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = '#b9b7a6'; ctx.fillRect(cx - 3, 206 + by, 6, 40);
    drawHead(ctx, this.face, p, cx + p.sway, 118 + by);
  },
};
