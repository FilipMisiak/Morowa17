import { ellipse, roundRect, rgba, drawHead, W } from './draw.js';

/** Konon ("krzysiu"): heavy build, short dark curly hair, stubble, big nose and ears, dark green sweatshirt with cream stripes. */
export default {
  id: 'konon',
  height: 1.82,
  glow: [235, 235, 215],
  face: { w: 70, h: 82, skin: [128, 138, 98], hair: [22, 18, 14], glow: [235, 235, 215], teeth: [196, 184, 140], nose: 0.17, jaw: 0.08, brow: 9, stubble: 260, curly: true, part: false, streak: false, seed: 11 },
  draw(ctx, p) {
    const cx = W / 2, by = p.bob, walk = p.walk;
    // legs + shoes
    const legSwing = walk === 1 ? 8 : walk === 2 ? -8 : 0;
    roundRect(ctx, cx - 62, 352 + by, 58, 140 + legSwing, 10, '#1a1814');
    roundRect(ctx, cx + 4, 352 + by, 58, 140 - legSwing, 10, '#1a1814');
    roundRect(ctx, cx - 70, 484 + legSwing, 70, 22, 9, '#0c0a08');
    roundRect(ctx, cx, 484 - legSwing, 70, 22, 9, '#0c0a08');
    // torso: dark green sweatshirt
    const body = new Path2D(); body.roundRect(cx - 108, 196 + by, 216, 190, 46);
    const g = ctx.createLinearGradient(cx - 108, 0, cx + 108, 0);
    g.addColorStop(0, '#223a22'); g.addColorStop(0.5, '#365634'); g.addColorStop(1, '#1c301d');
    ctx.fillStyle = g; ctx.fill(body);
    // arms with cream stripes
    for (const s of [-1, 1]) {
      const swing = walk ? s * (walk === 1 ? 10 : -10) : 0;
      roundRect(ctx, cx + s * 112 - 24, 206 + by + swing * 0.3, 48, 178, 22, '#2d4a2c');
      ctx.fillStyle = '#d6cfae'; ctx.fillRect(cx + s * 112 - 24, 238 + by, 48, 6); ctx.fillRect(cx + s * 112 - 24, 252 + by, 48, 6);
      ellipse(ctx, cx + s * 112, 392 + by + swing, 20, 24, rgba([120, 128, 92]));
    }
    // collar stripes
    ctx.fillStyle = '#27402a'; ctx.beginPath(); ctx.ellipse(cx, 204 + by, 66, 28, 0, 0, Math.PI); ctx.fill();
    ctx.strokeStyle = '#d6cfae'; ctx.lineWidth = 6;
    for (const o of [0, 11]) { ctx.beginPath(); ctx.ellipse(cx, 200 + by + o, 66, 26, 0, 0.1, Math.PI - 0.1); ctx.stroke(); }
    // folds
    ctx.strokeStyle = 'rgba(0,0,0,.28)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx - 30, 290 + by); ctx.quadraticCurveTo(cx, 310 + by, cx + 40, 288 + by); ctx.stroke();
    drawHead(ctx, this.face, p, cx + p.sway, 118 + by);
  },
};
