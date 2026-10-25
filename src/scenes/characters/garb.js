import { ellipse, roundRect, rgba, drawHead, W } from './draw.js';

/**
 * Data-driven body for the minor characters of tape 2: a torso (optionally striped / with a vest), sleeves, trousers and a hat.
 * o = { id, height, face, torso, sleeve?, stripe?, vest?, pants, hat?: { kind: 'cap'|'bucket'|'beanie'|'flat'|'hood', color }, skinHand }
 */
export function garbDef(o) {
  const sleeve = o.sleeve ?? o.torso;
  return {
    id: o.id,
    height: o.height ?? 1.75,
    face: o.face,
    draw(ctx, p) {
      const cx = W / 2, by = p.bob, walk = p.walk;
      const legSwing = walk === 1 ? 8 : walk === 2 ? -8 : 0;
      for (const s of [-1, 1]) {
        const x = s < 0 ? cx - 56 : cx + 4, sw = s < 0 ? legSwing : -legSwing;
        roundRect(ctx, x, 350 + by, 52, 140 + sw, 9, o.pants);
        roundRect(ctx, x - 6, 484 + sw, 64, 22, 9, '#0a0907');
      }
      roundRect(ctx, cx - 96, 196 + by, 192, 188, 42, o.torso);
      if (o.vest) { roundRect(ctx, cx - 96, 196 + by, 54, 188, 24, o.vest); roundRect(ctx, cx + 42, 196 + by, 54, 188, 24, o.vest); ctx.fillStyle = '#d8d8c0'; ctx.fillRect(cx - 96, 300 + by, 192, 7); }
      if (o.pocket) roundRect(ctx, cx - 60, 304 + by, 120, 44, 14, o.pocket);
      for (const s of [-1, 1]) {
        const swing = walk ? s * (walk === 1 ? 10 : -10) : 0;
        roundRect(ctx, cx + s * 104 - 21, 206 + by + swing * 0.3, 42, 170, 19, sleeve);
        if (o.stripe) { ctx.fillStyle = o.stripe; ctx.fillRect(cx + s * 104 - 21, 240 + by + swing * 0.3, 42, 5); ctx.fillRect(cx + s * 104 - 21, 254 + by + swing * 0.3, 42, 5); }
        ellipse(ctx, cx + s * 104, 384 + by + swing, 17, 21, o.gloves ?? rgba(o.face.skin));
      }
      const hx = cx + p.sway, hy = 118 + by, f = o.face;
      drawHead(ctx, f, p, hx, hy);
      const hat = o.hat;
      if (!hat) return;
      ctx.fillStyle = hat.color;
      if (hat.kind === 'beanie') { ctx.beginPath(); ctx.ellipse(hx, hy - 42, f.w * 1.02, 40, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(hx - f.w * 1.02, hy - 44, f.w * 2.04, 14); }
      else if (hat.kind === 'cap' || hat.kind === 'flat') { ctx.beginPath(); ctx.ellipse(hx, hy - 38, f.w * 1.04, 36, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(hx - f.w * 0.5, hy - 46, f.w * 1.6, hat.kind === 'flat' ? 10 : 8); }
      else if (hat.kind === 'bucket') { ctx.beginPath(); ctx.ellipse(hx, hy - 40, f.w * 0.95, 38, 0, Math.PI, 0); ctx.fill(); ctx.beginPath(); ctx.ellipse(hx, hy - 30, f.w * 1.3, 12, 0, 0, Math.PI * 2); ctx.fill(); }
      else if (hat.kind === 'hood') { ctx.beginPath(); ctx.ellipse(hx, hy - 10, f.w * 1.25, f.h * 1.12, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(hx - f.w * 1.25, hy - 10, f.w * 0.3, f.h * 0.9); ctx.fillRect(hx + f.w * 0.95, hy - 10, f.w * 0.3, f.h * 0.9); }
    },
  };
}
