import * as THREE from 'three';
import { psxify } from '../../render/psx.js';

/** The winter garden (ep10, 04:04): snow, wrought-iron railings with ornaments, a CRT television on a white pedestal. */
export function buildZima() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xc8c4b0);
  scene.fog = new THREE.FogExp2(0xb8b4a0, 0.05);
  const lam = (o) => psxify(new THREE.MeshLambertMaterial(o));
  const add = (geo, m, x, y, z, rx = 0, ry = 0) => { const me = new THREE.Mesh(geo, m); me.position.set(x, y, z); me.rotation.set(rx, ry, 0); scene.add(me); return me; };

  add(new THREE.PlaneGeometry(40, 40), lam({ color: 0xe0e0d8 }), 0, 0, 0, -Math.PI / 2);

  // wrought-iron railing: posts, rails, spears, scroll circles
  const iron = lam({ color: 0x14130e });
  add(new THREE.BoxGeometry(8, 0.05, 0.05), iron, 0, 0.25, -1.5); add(new THREE.BoxGeometry(8, 0.05, 0.05), iron, 0, 1.25, -1.5);
  for (let x = -4; x <= 4; x += 0.16) { add(new THREE.BoxGeometry(0.025, 1.3, 0.025), iron, x, 0.65, -1.5); add(new THREE.ConeGeometry(0.03, 0.1, 4), iron, x, 1.33, -1.5); }
  for (let x = -3.8; x <= 3.8; x += 0.8) add(new THREE.TorusGeometry(0.12, 0.012, 4, 10), iron, x, 0.75, -1.5);

  // television on a white pedestal
  add(new THREE.BoxGeometry(0.5, 0.9, 0.5), lam({ color: 0xe8e8e0 }), 0.3, 0.45, -0.4);
  add(new THREE.BoxGeometry(0.62, 0.5, 0.5), lam({ color: 0x2a2a26 }), 0.3, 1.15, -0.4);
  add(new THREE.PlaneGeometry(0.42, 0.34), new THREE.MeshBasicMaterial({ color: 0x8aa890 }), 0.3, 1.17, -0.14);

  // ep20: a black suitcase with a sticker, a plastic bucket and a broom in the snow
  add(new THREE.BoxGeometry(0.5, 0.7, 0.25), lam({ color: 0x0c0c0e }), 3.2, 0.35, 2.4);
  add(new THREE.BoxGeometry(0.18, 0.12, 0.01), new THREE.MeshBasicMaterial({ color: 0xe8e0c0 }), 3.2, 0.5, 2.53);
  add(new THREE.CylinderGeometry(0.17, 0.13, 0.3, 8), lam({ color: 0x3a62c8 }), 2.6, 0.15, 2.6);
  add(new THREE.BoxGeometry(0.03, 1.4, 0.03), lam({ color: 0x5a4226 }), 2.4, 0.7, 2.5, 0, 0, 0.15);

  scene.add(new THREE.HemisphereLight(0xe0e0d0, 0x9a9a88, 2.6));
  return {
    scene, hotspots: [], setHover() {},
    nodes: {
      tv:    { label: 'TELEWIZOR', pos: [-0.2, 1.4, 2.2], look: [0.3, 1.1, -0.4], fov: 52 },
      walizka: { label: 'WALIZKA', pos: [1.6, 1.3, 4.6], look: [3.0, 0.5, 2.4], fov: 52 },
      krata: { label: 'KRATA',     pos: [-1.5, 1.3, 1.4], look: [0.6, 0.9, -1.5], fov: 55 },
    },
    startCamera: 'tv',
    update() {},
  };
}
