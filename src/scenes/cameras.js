import * as THREE from 'three';
import { state } from '../core/state.js';
import { bus } from '../core/bus.js';

/** Fixed camera nodes ("tape cameras"). `dark: true` = a dark corner is in frame (drains sanity). */
export const CAMERA_NODES = {
  door:  { label: 'WEJŚCIE', pos: [2.3, 1.55, 1.8],  look: [-0.8, 1.0, -1.2], fov: 62 },
  desk:  { label: 'BIURKO',  pos: [-0.4, 1.5, 0.2],  look: [-1.7, 0.95, -1.6], fov: 52 },
  hatch: { label: 'STRYCH',  pos: [0.2, 1.1, 1.2],   look: [0, 2.5, -0.3], fov: 70, dark: true },
  stove: { label: 'PIEC',    pos: [0.3, 1.6, 0.6],   look: [1.8, 0.8, -1.5], fov: 58 },
  // scripted nodes (no button, no key): shots of the original that only the episode asks for
  zbliz:  { label: 'ZBLIŻENIE', pos: [1.2, 0.45, -0.1], look: [1.2, 1.65, -1.05], fov: 40, scripted: true },
  kanapa: { label: 'KANAPA', pos: [-1.0, 1.5, 0.3], look: [0.4, 1.2, 1.55], fov: 58, scripted: true },
  drzwi:  { label: 'DRZWI', pos: [-0.6, 1.5, -0.8], look: [2.46, 1.25, 1.45], fov: 55, scripted: true },
  window: { label: 'OKNO',  pos: [0.6, 1.5, 0.4],   look: [2.5, 1.4, 0.4], fov: 56 },
};

export function createCameraRig(aspect = 4 / 3) {
  const camera = new THREE.PerspectiveCamera(60, aspect, 0.05, 30);
  const sway = { x: 0, y: 0 };
  let nodes = CAMERA_NODES;

  const rig = {
    camera,
    aim: 1, // multiplier of the pointer sway; the camcorder raises it to let the player pan the shot
    get node() { return nodes[state.cameraId]; },
    setNodes(n) { nodes = n; },
    nodes: () => nodes,
    goTo(id) {
      const n = nodes[id];
      if (!n) return;
      state.cameraId = id;
      camera.position.set(...n.pos);
      camera.fov = (n.fov ?? 60) / state.cam.zoom;
      camera.updateProjectionMatrix();
      bus.emit('camera', id);
      bus.emit('camera:' + id, id);
    },
    /** pointer in NDC (-1..1) gives a few degrees of "breathing" parallax. */
    update(dt, pointer) {
      const n = nodes[state.cameraId];
      if (!n) return;
      sway.x += ((pointer?.x ?? 0) * 0.07 * rig.aim - sway.x) * Math.min(1, dt * 3);
      sway.y += ((pointer?.y ?? 0) * 0.04 * rig.aim - sway.y) * Math.min(1, dt * 3);
      const fov = (n.fov ?? 60) / state.cam.zoom;
      if (Math.abs(camera.fov - fov) > 0.01) { camera.fov += (fov - camera.fov) * Math.min(1, dt * 8); camera.updateProjectionMatrix(); }
      camera.lookAt(...n.look);
      camera.rotateY(-sway.x);
      camera.rotateX(sway.y);
    },
  };
  return rig;
}
