import { ellipse, roundRect, rgba, drawHead, W } from './draw.js';

/** The broad man in the brown-green jacket at the table (ep09, 01:49): cropped, balding, heavy. */
export default {
  id: 'brazowy',
  height: 1.72,
  face: { w: 68, h: 78, skin: [160, 150, 118], hair: [40, 36, 28], glow: [200, 170, 60], teeth: [214, 204, 168], nose: 0.14, jaw: 0.06, brow: 5, stubble: 80, curly: false, part: false, seed: 71 },
  draw(ctx, p) {
    const cx = W / 2, by = p.bob, walk = p.walk;
    const legSwing = walk === 1 ? 8 : walk === 2 ? -8 : 0;
    for (const s of [-1, 1]) {
      const x = s < 0 ? cx - 58 : cx + 4, sw = s < 0 ? legSwing : -legSwing;
      roundRect(ctx, x, 350 + by, 54, 140 + sw, 9, '#23201a');
      roundRect(ctx, x - 6, 484 + sw, 66, 22, 9, '#0a0907');
    }
    roundRect(ctx, cx - 100, 196 + by, 200, 186, 40, '#4a4a26');
    ctx.fillStyle = '#34341a'; ctx.fillRect(cx - 2, 214 + by, 4, 164);
    for (const s of [-1, 1]) {
      const swing = walk ? s * (walk === 1 ? 10 : -10) : 0;
      roundRect(ctx, cx + s * 108 - 22, 206 + by + swing * 0.3, 44, 170, 20, '#44441f');
      ellipse(ctx, cx + s * 108, 384 + by + swing, 18, 22, rgba([156, 146, 114]));
    }
    drawHead(ctx, this.face, p, cx + p.sway, 118 + by);
  },
};
