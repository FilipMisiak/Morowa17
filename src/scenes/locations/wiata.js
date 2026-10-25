import * as THREE from 'three';
import { psxify } from '../../render/psx.js';
import { mulberry32 } from '../../core/rng.js';
import { leafLitter, leafCluster } from '../../procedural/decor.js';
import { rustTexture } from '../../procedural/textures.js';

/** The shelter in the thicket (ep15): a brown pipe-frame canopy, a table with a white sheet of paper, a rusty vehicle body, dense green bushes. */
export function buildWiata() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2a4a2c);
  scene.fog = new THREE.FogExp2(0x3a5a3a, 0.07);
  const lam = (o) => psxify(new THREE.MeshLambertMaterial(o));
  const rnd = mulberry32(53);
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => { const me = new THREE.Mesh(geo, m); me.position.set(x, y, z); me.rotation.set(rx, ry, rz); me.castShadow = me.receiveShadow = true; scene.add(me); return me; };

  add(new THREE.PlaneGeometry(30, 30), lam({ map: leafLitter([8, 8]), color: 0x88a870 }), 0, 0, 0, -Math.PI / 2);

  // canopy: four pipe legs, a flat brown roof
  const brown = lam({ color: 0x5a3a22 });
  for (const [x, z] of [[-1.6, -1.0], [1.6, -1.0], [-1.6, 1.0], [1.6, 1.0]]) add(new THREE.CylinderGeometry(0.04, 0.04, 2.3, 6), brown, x, 1.15, z);
  add(new THREE.BoxGeometry(3.6, 0.08, 2.4), lam({ color: 0x6a4a2a }), 0, 2.3, 0);

  // table with a sheet of paper and a mug
  add(new THREE.BoxGeometry(1.2, 0.05, 0.7), lam({ color: 0x8a8a84 }), 0, 0.78, -0.3);
  for (const [x, z] of [[-0.55, -0.6], [0.55, -0.6], [-0.55, 0], [0.55, 0]]) add(new THREE.BoxGeometry(0.04, 0.78, 0.04), lam({ color: 0x5a5a56 }), x, 0.39, z);
  add(new THREE.BoxGeometry(0.3, 0.005, 0.42), new THREE.MeshBasicMaterial({ color: 0xf0f0e4 }), 0.1, 0.815, -0.2, 0, 0.2);
  add(new THREE.CylinderGeometry(0.05, 0.045, 0.1, 8), lam({ color: 0xc8c8b8 }), -0.4, 0.85, -0.4);

  // rusty vehicle body in the thicket on the right
  const rust = lam({ map: rustTexture(), color: 0xb08060 });
  add(new THREE.BoxGeometry(1.6, 0.9, 3.0), rust, 3.4, 0.6, -0.4, 0, 0.15);
  add(new THREE.BoxGeometry(1.4, 0.6, 1.4), rust, 3.4, 1.35, 0.3, 0, 0.15);
  for (const z of [-1.4, 0.6]) add(new THREE.CylinderGeometry(0.34, 0.34, 0.25, 10), lam({ color: 0x14120e }), 2.6, 0.34, z, 0, 0, Math.PI / 2);

  // bushes all around
  const mats = [leafCluster(11, [36, 94, 32]), leafCluster(12, [28, 70, 26]), leafCluster(13, [48, 104, 40])]
    .map((t) => psxify(new THREE.MeshBasicMaterial({ map: t, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide, color: 0xc0e0b8 })));
  for (let i = 0; i < 70; i++) {
    const a = rnd() * Math.PI * 2, r = 3.2 + rnd() * 3;
    const x = Math.cos(a) * r, z = Math.sin(a) * r - 1;
    if (x > 1.6 && Math.abs(z) < 2.4) continue;
    for (let k = 0; k < 2; k++) { const q = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.4 + rnd()), mats[(i + k) % 3]); q.position.set(x, 0.9, z); q.rotation.y = rnd() * 3 + k * 1.5; scene.add(q); }
  }

  scene.add(new THREE.HemisphereLight(0xb8e0b0, 0x4a5a3a, 5.0));
  const sun = new THREE.DirectionalLight(0xd8f0c0, 1.2); sun.position.set(-3, 6, 4); scene.add(sun);

  return {
    scene, hotspots: [], setHover() {},
    nodes: {
      wiata: { label: 'WIATA', pos: [0.0, 1.5, 3.2], look: [0, 1.2, -0.3], fov: 52 },
      stol:  { label: 'STÓŁ',  pos: [0.3, 1.5, 1.6], look: [0, 0.8, -0.3], fov: 46 },
      wrak:  { label: 'WRAK',  pos: [0.6, 1.4, 2.6], look: [3.2, 0.9, -0.4], fov: 55 },
    },
    startCamera: 'wiata',
    update() {},
  };
}
