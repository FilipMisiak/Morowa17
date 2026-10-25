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
    const over = e.target.closest?.('#hud-cams, #hud-items, #hud-rec-btn, #hud-tools, #menu, #help, #start, #result');
    const ndc = pipeline.pointerToNDC(e);
    if (e.pointerType !== 'mouse' && ndc && !over) { // touch has no hover: a tap aims and highlights first
      pointer.copy(ndc);
      const t = pick(ndc);
      if (t?.id !== hovered?.id) { hovered = t; onHover?.(t); }
    }
    if (!enabled || e.button !== 0 || state.cam.raised || over) return;
    const h = pick(ndc);
    if (h) bus.emit('interact:' + h.id, h);
  });

  return { pointer, setEnabled(v) { enabled = v; } };
}
