import * as THREE from 'three';
import { psxify } from '../../render/psx.js';
import { woodTexture } from '../../procedural/textures.js';
import { brickTexture } from '../../procedural/decor.js';

/** Three small stages of ep17 side by side: the poet's room (barbed-wire barred window, oil lamp), the room with red velvet curtains and a quilted coat, and the white kitchen with a grinning head above the counter. */
export function buildPoeta() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x060504);
  scene.fog = new THREE.FogExp2(0x0c0a08, 0.1);
  const lam = (o) => psxify(new THREE.MeshLambertMaterial(o));
  const basic = (o) => new THREE.MeshBasicMaterial(o);
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => { const me = new THREE.Mesh(geo, m); me.position.set(x, y, z); me.rotation.set(rx, ry, rz); me.castShadow = me.receiveShadow = true; scene.add(me); return me; };
  const floor = lam({ map: woodTexture({ seed: 81, planks: 6, repeat: [1, 1], dark: [24, 18, 12], light: [70, 54, 34] }) });
  const room = (cx, wallMat) => {
    add(new THREE.PlaneGeometry(4, 4), floor, cx, 0, 0, -Math.PI / 2);
    add(new THREE.PlaneGeometry(4, 4), lam({ color: 0x14100c }), cx, 2.4, 0, Math.PI / 2);
    add(new THREE.PlaneGeometry(4, 2.4), wallMat, cx, 1.2, -2);
    add(new THREE.PlaneGeometry(4, 2.4), wallMat, cx - 2, 1.2, 0, 0, Math.PI / 2);
    add(new THREE.PlaneGeometry(4, 2.4), wallMat, cx + 2, 1.2, 0, 0, -Math.PI / 2);
  };

  // 1. poet's room (x = 0): window wrapped in barbed wire, oil lamp on a table, sheet of paper
  room(0, lam({ color: 0x2a2018 }));
  add(new THREE.BoxGeometry(1.0, 1.3, 0.06), basic({ color: 0x3a5a40 }), 0, 1.5, -1.95);
  const wire = lam({ color: 0x8a8a84 });
  for (const x of [-0.4, -0.13, 0.13, 0.4]) add(new THREE.BoxGeometry(0.03, 1.3, 0.03), wire, x, 1.5, -1.9);
  for (const y of [1.0, 1.3, 1.6, 1.9]) add(new THREE.BoxGeometry(1.1, 0.025, 0.025), wire, 0, y, -1.88);
  add(new THREE.BoxGeometry(0.9, 0.05, 0.5), lam({ color: 0x6a4a2a }), 0.6, 0.8, -1.2);
  add(new THREE.CylinderGeometry(0.07, 0.09, 0.14, 8), lam({ color: 0xb08a30 }), 0.9, 0.88, -1.2);
  add(new THREE.CylinderGeometry(0.07, 0.07, 0.24, 8), basic({ color: 0xffd080 }), 0.9, 1.08, -1.2);
  add(new THREE.BoxGeometry(0.3, 0.01, 0.4), basic({ color: 0xf0e8b0 }), 0.4, 0.84, -1.2);

  // 2. room with red velvet curtains (x = 6): bricks, a quilted pale coat on a hanger, cartons, a glass on a table
  room(6, lam({ map: brickTexture([2, 1.5]), color: 0x8a6a5a }));
  for (const x of [4.4, 7.6]) add(new THREE.BoxGeometry(0.9, 2.3, 0.15), lam({ color: 0x8a1818 }), x, 1.15, -1.9);
  add(new THREE.BoxGeometry(0.6, 1.0, 0.18), lam({ color: 0xe0d8c0 }), 6.6, 1.3, -1.9);
  add(new THREE.BoxGeometry(0.5, 0.4, 0.4), lam({ color: 0xa08a60 }), 5.2, 0.2, -1.5);
  add(new THREE.BoxGeometry(0.5, 0.4, 0.4), lam({ color: 0xa08a60 }), 5.2, 0.6, -1.5);
  add(new THREE.BoxGeometry(0.8, 0.05, 0.5), lam({ color: 0x5a3a22 }), 6.2, 0.7, -0.8);
  add(new THREE.CylinderGeometry(0.04, 0.035, 0.1, 6), basic({ color: 0xc8d8d0 }), 6.0, 0.78, -0.8);

  // 3. white kitchen (x = 12): hanging cupboards with metal knobs, a counter, a mug and a jug, a grinning head floating above
  room(12, lam({ color: 0xc8c4a8 }));
  for (let i = 0; i < 3; i++) add(new THREE.BoxGeometry(0.8, 0.8, 0.35), lam({ color: 0xf0eee0 }), 11.0 + i * 0.85, 1.7, -1.8);
  add(new THREE.BoxGeometry(2.8, 0.9, 0.6), lam({ color: 0xe8e4d4 }), 12, 0.45, -1.7);
  add(new THREE.CylinderGeometry(0.05, 0.045, 0.1, 8), lam({ color: 0x9a9a90 }), 11.4, 0.95, -1.6);
  add(new THREE.CylinderGeometry(0.07, 0.06, 0.2, 8), lam({ color: 0xb8c0b0 }), 12.4, 1.0, -1.6);
  const head = add(new THREE.SphereGeometry(0.22, 10, 8), lam({ color: 0xc8a888 }), 12, 1.3, -1.2);
  head.scale.set(1, 1.1, 0.9);
  for (const dx of [-0.08, 0.08]) add(new THREE.SphereGeometry(0.04, 6, 5), basic({ color: 0xf0f0e0 }), 12 + dx, 1.36, -1.02);
  add(new THREE.BoxGeometry(0.18, 0.04, 0.03), basic({ color: 0xf0f0e0 }), 12, 1.2, -1.02);

  // 4. red room (x = 18, ep18): red curtains, a zebra sofa with a black hat, a table with a laptop and mugs
  room(18, lam({ color: 0x3a1010 }));
  for (const x of [16.4, 19.6]) add(new THREE.BoxGeometry(0.9, 2.3, 0.15), lam({ color: 0x9a1a1a }), x, 1.15, -1.9);
  add(new THREE.BoxGeometry(0.9, 1.1, 0.04), basic({ color: 0xe8e0d0 }), 18, 1.4, -1.95);
  add(new THREE.BoxGeometry(1.4, 0.5, 0.7), lam({ color: 0xd8d4c8 }), 16.9, 0.25, -1.2);
  for (let i = 0; i < 4; i++) add(new THREE.BoxGeometry(1.42, 0.06, 0.12), lam({ color: 0x14120e }), 16.9, 0.15 + i * 0.11, -1.2 + (i % 2) * 0.2);
  add(new THREE.CylinderGeometry(0.12, 0.14, 0.05, 8), lam({ color: 0x0c0c0c }), 17.2, 0.55, -1.2);
  add(new THREE.BoxGeometry(1.0, 0.05, 0.6), lam({ color: 0x5a3a22 }), 18.8, 0.7, -0.4);
  add(new THREE.BoxGeometry(0.4, 0.02, 0.28), lam({ color: 0xa8aab0 }), 18.7, 0.75, -0.4);
  add(new THREE.BoxGeometry(0.4, 0.26, 0.02), basic({ color: 0x8a9a8a }), 18.7, 0.88, -0.55);
  add(new THREE.CylinderGeometry(0.04, 0.035, 0.09, 6), lam({ color: 0xc03030 }), 19.1, 0.78, -0.3);

  scene.add(new THREE.HemisphereLight(0x90805a, 0x2a2018, 1.6));
  for (const [x, c, i] of [[0.8, 0xffc060, 12], [6, 0xff6a50, 10], [12, 0xe8e8d0, 12], [18, 0xff5040, 12]]) { const l = new THREE.PointLight(c, i, 0, 2); l.position.set(x, 1.6, 0); scene.add(l); }
  return {
    scene, hotspots: [], setHover() {},
    nodes: {
      okno:    { label: 'OKNO',     pos: [0.4, 1.4, 1.2],  look: [0.2, 1.3, -1.9], fov: 48 },
      zaslony: { label: 'ZASŁONY',  pos: [6.0, 1.4, 1.2],  look: [6.0, 1.1, -1.6], fov: 55 },
      czerwony: { label: 'CZERWONY POKÓJ', pos: [18.0, 1.4, 1.3], look: [17.9, 0.9, -1.2], fov: 55 },
      kuchnia: { label: 'KUCHNIA',  pos: [12.0, 1.4, 1.3], look: [12.0, 1.1, -1.6], fov: 50 },
    },
    startCamera: 'okno',
    update() {},
  };
}
