import { ellipse, roundRect, rgba, drawHead, W } from './draw.js';

/** "Męczennik" (ep09): pale green mask-like face, black sockets, a huge toothy grin, messy dark hair, black hoodie. */
export default {
  id: 'meczennik',
  height: 1.72,
  face: { w: 64, h: 82, skin: [150, 172, 140], hair: [18, 16, 14], glow: [10, 10, 8], teeth: [226, 224, 196], nose: 0.12, jaw: 0.05, brow: 8, stubble: 20, curly: true, part: false, seed: 63 },
  draw(ctx, p) {
    const cx = W / 2, by = p.bob, walk = p.walk;
    const legSwing = walk === 1 ? 8 : walk === 2 ? -8 : 0;
    for (const s of [-1, 1]) {
      const x = s < 0 ? cx - 56 : cx + 4, sw = s < 0 ? legSwing : -legSwing;
      roundRect(ctx, x, 350 + by, 52, 140 + sw, 9, '#0f0f0d');
      roundRect(ctx, x - 6, 484 + sw, 64, 22, 9, '#060605');
    }
    // black hoodie with a hood bunched behind the neck and a kangaroo pocket
    roundRect(ctx, cx - 94, 198 + by, 188, 184, 42, '#0b0b0a');
    roundRect(ctx, cx - 60, 300 + by, 120, 50, 14, '#111110');
    ellipse(ctx, cx, 208 + by, 70, 22, '#151513');
    ctx.fillStyle = '#2a2a26'; ctx.fillRect(cx - 14, 222 + by, 2, 44); ctx.fillRect(cx + 12, 222 + by, 2, 44);
    for (const s of [-1, 1]) {
      const swing = walk ? s * (walk === 1 ? 10 : -10) : 0;
      roundRect(ctx, cx + s * 102 - 20, 208 + by + swing * 0.3, 40, 170, 18, '#0b0b0a');
      ellipse(ctx, cx + s * 102, 384 + by + swing, 17, 21, rgba([150, 168, 138]));
    }
    drawHead(ctx, this.face, p, cx + p.sway, 118 + by);
  },
};
