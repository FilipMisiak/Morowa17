import * as THREE from 'three';
import { bus } from './bus.js';
import { state } from './state.js';

const raycaster = new THREE.Raycaster();

/** Pointer tracking + hotspot picking against the letterboxed picture. */
export function createInput({ canvas, pipeline, getCamera, getHotspots, onHover }) {
  const pointer = new THREE.Vector2(0, 0);
  let hovered = null;
  let enabled = true;

  function pick(ndc) {
    if (!ndc) return null;
    raycaster.setFromCamera(ndc, getCamera());
    const hit = raycaster.intersectObjects(getHotspots(), false)[0];
    return hit?.object.userData.hotspot ?? null;
  }

  window.addEventListener('pointermove', (e) => {
    const ndc = pipeline.pointerToNDC(e);
    if (ndc) pointer.copy(ndc);
    if (!enabled) return;
    const h = pick(ndc);
    if (h?.id !== hovered?.id) { hovered = h; onHover?.(h); canvas.style.cursor = h ? 'pointer' : 'default'; }
  });

  window.addEventListener('pointerdown', (e) => {
    if (!enabled || e.button !== 0 || state.cam.raised || e.target.closest?.('#hud-cams, #hud-items, #hud-rec-btn, #menu, #start, #result')) return;
    const h = pick(pipeline.pointerToNDC(e));
    if (h) bus.emit('interact:' + h.id, h);
  });

  return { pointer, setEnabled(v) { enabled = v; } };
}
