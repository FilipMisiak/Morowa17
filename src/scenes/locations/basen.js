import * as THREE from 'three';
import { psxify } from '../../render/psx.js';
import { mulberry32 } from '../../core/rng.js';
import { leafLitter, leafCluster, redPlanks } from '../../procedural/decor.js';
import { woodTexture } from '../../procedural/textures.js';

/** The summer yard of ep13: a plank house with white-framed green windows, an inflatable turquoise pool, a stump, a metal ladder and a grey bin. */
export function buildBasen() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x3a6a40);
  scene.fog = new THREE.FogExp2(0x4a7a48, 0.05);
  const lam = (o) => psxify(new THREE.MeshLambertMaterial(o));
  const rnd = mulberry32(41);
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => { const me = new THREE.Mesh(geo, m); me.position.set(x, y, z); me.rotation.set(rx, ry, rz); me.castShadow = true; scene.add(me); return me; };

  add(new THREE.PlaneGeometry(30, 30), lam({ map: leafLitter([8, 8]), color: 0x90c070 }), 0, 0, 0, -Math.PI / 2);
  add(new THREE.BoxGeometry(10, 3.0, 0.3), lam({ map: redPlanks([5, 2]), color: 0xa09070 }), 0, 1.5, -3.5);
  for (const x of [-2.4, 1.2]) { add(new THREE.BoxGeometry(1.1, 1.2, 0.06), lam({ color: 0xe8e8e0 }), x, 1.6, -3.33); add(new THREE.BoxGeometry(0.9, 1.0, 0.07), new THREE.MeshBasicMaterial({ color: 0x4a9a58 }), x, 1.6, -3.32); }
  add(new THREE.BoxGeometry(0.9, 2.0, 0.08), lam({ color: 0xe8e8e0 }), -0.6, 1.0, -3.33);

  // inflatable pool: a turquoise ring, a water disc
  add(new THREE.TorusGeometry(1.3, 0.2, 8, 20), lam({ color: 0x28b0b8 }), 0.4, 0.35, 0.6, Math.PI / 2);
  add(new THREE.CircleGeometry(1.2, 20), lam({ color: 0x4ac8d0 }), 0.4, 0.2, 0.6, -Math.PI / 2);
  add(new THREE.CylinderGeometry(0.3, 0.34, 0.45, 10), lam({ map: woodTexture({ seed: 44, planks: 1, repeat: [1, 1], light: [130, 96, 56] }) }), -1.6, 0.22, 1.0);

  // metal ladder, grey bin and a railing
  const metal = lam({ color: 0x8a8e90 });
  for (const x of [-3.9, -3.5]) add(new THREE.BoxGeometry(0.05, 2.6, 0.05), metal, x, 1.3, -3.2, -0.08);
  for (let i = 0; i < 8; i++) add(new THREE.BoxGeometry(0.4, 0.04, 0.04), metal, -3.7, 0.3 + i * 0.3, -3.22);
  add(new THREE.BoxGeometry(0.9, 1.0, 0.7), lam({ color: 0x70747a }), 3.4, 0.5, -2.8);
  for (let x = 2.2; x <= 3.0; x += 0.2) add(new THREE.BoxGeometry(0.03, 0.9, 0.03), metal, x, 0.45, -2.0);

  const mats = [leafCluster(9, [40, 100, 36]), leafCluster(10, [30, 80, 30])]
    .map((t) => psxify(new THREE.MeshBasicMaterial({ map: t, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide, color: 0xc0e0b8 })));
  for (const [x, z] of [[-5, 0], [5, 1], [-4.2, 3.4], [4.6, 3.6]]) { add(new THREE.CylinderGeometry(0.12, 0.18, 2.6, 6), lam({ color: 0x2a2218 }), x, 1.3, z); for (let i = 0; i < 3; i++) { const q = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.2), mats[i & 1]); q.position.set(x, 3 + rnd() * 0.3, z); q.rotation.y = i * 1.1; scene.add(q); } }

  scene.add(new THREE.HemisphereLight(0xd0f0c8, 0x5a6a40, 5.0));
  const sun = new THREE.DirectionalLight(0xe0f0c0, 1.4); sun.position.set(-3, 6, 4); scene.add(sun);

  return {
    scene, hotspots: [], setHover() {},
    nodes: {
      basen:  { label: 'BASEN',   pos: [-1.0, 1.7, 4.2], look: [0.4, 0.3, 0.6], fov: 52 },
      ganek:  { label: 'GANEK',   pos: [-0.6, 1.5, 0.8], look: [-0.6, 1.2, -3.3], fov: 50 },
      pienek: { label: 'PIENIEK', pos: [-0.4, 1.4, 3.2], look: [-1.6, 0.4, 1.0], fov: 48 },
    },
    startCamera: 'basen',
    update() {},
  };
}
