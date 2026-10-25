import { ellipse, roundRect, W } from './draw.js';

/** The hooded visitor with a dog mask (ep10): long olive-brown coat, hood, a muzzle with a wet black nose and pale eyes, a belt buckle and a long dark thing on the shoulder. */
export default {
  id: 'maska',
  height: 1.85,
  face: {},
  draw(ctx, p) {
    const cx = W / 2 + p.sway, by = p.bob, walk = p.walk;
    const legSwing = walk === 1 ? 8 : walk === 2 ? -8 : 0;
    for (const s of [-1, 1]) {
      const x = s < 0 ? cx - 52 : cx + 2, sw = s < 0 ? legSwing : -legSwing;
      roundRect(ctx, x, 360 + by, 50, 130 + sw, 9, '#14130c');
      roundRect(ctx, x - 6, 484 + sw, 62, 22, 9, '#080806');
    }
    // long coat down to the knees, belt with a buckle
    roundRect(ctx, cx - 100, 190 + by, 200, 240, 40, '#3a3820');
    ctx.fillStyle = '#25240f'; ctx.fillRect(cx - 100, 300 + by, 200, 14);
    roundRect(ctx, cx - 12, 298 + by, 24, 18, 3, '#b8a850');
    for (const s of [-1, 1]) {
      const arm = new Path2D(); arm.roundRect(cx + s * 106 - 20, 204 + by, 40, 176, 18);
      ctx.fillStyle = '#34321c'; ctx.fill(arm);
      ellipse(ctx, cx + s * 106, 384 + by, 17, 21, '#16150f');
    }
    // long dark object over the right shoulder
    ctx.save(); ctx.translate(cx + 90, 210 + by); ctx.rotate(-0.25);
    roundRect(ctx, -10, -150, 16, 330, 6, '#0a0a08');
    ctx.restore();
    // hood and the dog's head
    ellipse(ctx, cx, 120 + by, 78, 92, '#2c2a16');
    ellipse(ctx, cx, 132 + by, 56, 66, '#6a4a28');
    const jaw = p.viseme ? 10 : 0;
    ellipse(ctx, cx, 168 + by, 34, 40 + jaw * 0.4, '#8a6a40');
    ellipse(ctx, cx, 150 + by, 14, 11, '#050504');
    ctx.fillStyle = '#d8d0b0'; ctx.fillRect(cx - 1, 160 + by, 2, 16 + jaw);
    for (const s of [-1, 1]) {
      ellipse(ctx, cx + s * 24, 112 + by, 9, 7, p.blink ? '#3a2a18' : '#e8ecd0');
      if (!p.blink) ellipse(ctx, cx + s * 24, 112 + by, 3, 3, '#101008');
      ellipse(ctx, cx + s * 52, 70 + by, 14, 30, '#4a3418'); // ears under the hood
    }
  },
};
