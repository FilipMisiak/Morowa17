import * as THREE from 'three';
import { psxify } from '../../render/psx.js';
import { W, H } from './draw.js';

const K = 0.6; // canvas pixels per logical unit (192x307): about 1:1 with the 384x288 render at typical distances

/**
 * A drawn 2D character standing in the 3D scene (billboard). The canvas is redrawn only when the pose signature
 * changes (mouth shape, blink, breathing step, walk frame), so it stays cheap on the stepped clock.
 */
export function createSprite(def) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(W * K); canvas.height = Math.round(H * K);
  const ctx = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const h = def.height, w = h * (W / H);
  const geo = new THREE.PlaneGeometry(w, h); geo.translate(0, h / 2, 0);
  const mat = psxify(new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.3, color: 0xd8d8d0 }));
  const mesh = new THREE.Mesh(geo, mat);

  const pose = { viseme: 0, blink: false, gaze: 0, mad: 0, brow: 0, bob: 0, sway: 0, walk: 0 };
  let sig = '';
  const rt = { blinkAt: 2 + Math.random() * 3, blinkUntil: 0, mouthUntil: 0, viseme: 0 };

  function redraw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(K, 0, 0, K, 0, 0);
    def.draw(ctx, pose);
    texture.needsUpdate = true;
  }
  pose.mad = 0; redraw();

  return {
    mesh,
    /** Mouth shape for a typed character; it closes by itself shortly after the last one. */
    mouth(viseme, now) { rt.viseme = viseme; rt.mouthUntil = now + 0.16; },
    /** t = stepped clock (s), now = real clock (s), mad = madness 0..1, walking = bool. */
    update(t, now, mad, walking) {
      if (t > rt.blinkAt) { rt.blinkUntil = t + 0.16; rt.blinkAt = t + 2 + Math.random() * 3.5; }
      pose.blink = t < rt.blinkUntil;
      pose.viseme = now < rt.mouthUntil ? rt.viseme : 0;
      pose.mad = Math.round(mad * 4) / 4;
      pose.brow = Math.round(Math.min(1, mad * 1.2) * 2) / 2;
      pose.bob = Math.round(Math.sin(t * 1.9) * 2);
      pose.sway = Math.round(Math.sin(t * 0.8) * 2);
      pose.gaze = Math.round(Math.sin(t * 0.37 + 1) * 1.4) / 1.4;
      pose.walk = walking ? 1 + (Math.floor(t * 6) % 2) : 0;
      const s = `${pose.viseme}${+pose.blink}${pose.bob}${pose.sway}${pose.walk}${pose.mad}${pose.brow}${pose.gaze}`;
      if (s !== sig) { sig = s; redraw(); }
    },
  };
}
