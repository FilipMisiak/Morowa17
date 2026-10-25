import * as THREE from 'three';
import { psxify } from '../../render/psx.js';
import { mulberry32 } from '../../core/rng.js';
import { leafLitter, leafCluster, redPlanks } from '../../procedural/decor.js';
import { woodTexture } from '../../procedural/textures.js';

/** The back yard of tape 2 (ep11): red plank wall with a washing line, a rack grill with sausages, a chopping stump, a bench with a bowl, a blue tarp over concrete steps, a green ladder to a dark hatch. */
export function buildGrill() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x24402a);
  scene.fog = new THREE.FogExp2(0x2a4a2c, 0.06);
  const lam = (o) => psxify(new THREE.MeshLambertMaterial(o));
  const rnd = mulberry32(31);
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => { const me = new THREE.Mesh(geo, m); me.position.set(x, y, z); me.rotation.set(rx, ry, rz); me.castShadow = true; scene.add(me); return me; };

  add(new THREE.PlaneGeometry(30, 30), lam({ map: leafLitter([8, 8]), color: 0x88a870 }), 0, 0, 0, -Math.PI / 2);

  // house wall behind (z = -4) with a hatch opening and a ladder leaning on it
  add(new THREE.BoxGeometry(12, 3.2, 0.3), lam({ map: redPlanks([5, 2]), color: 0xb09080 }), 0, 1.6, -4);
  add(new THREE.BoxGeometry(0.9, 0.9, 0.05), new THREE.MeshBasicMaterial({ color: 0x000000 }), 3.0, 2.4, -3.82);
  const green = lam({ color: 0x3a6a3a });
  for (const x of [2.7, 3.3]) add(new THREE.BoxGeometry(0.05, 3.0, 0.05), green, x, 1.5, -3.7, -0.12);
  for (let i = 0; i < 9; i++) add(new THREE.BoxGeometry(0.6, 0.04, 0.04), green, 3.0, 0.3 + i * 0.32, -3.74 + i * 0.012, -0.12);

  // washing line between two posts: blue shirt, dark trousers
  const post = lam({ color: 0x3a2c1c });
  for (const x of [-3.5, -1.0]) add(new THREE.BoxGeometry(0.08, 2.2, 0.08), post, x, 1.1, -3.0);
  add(new THREE.BoxGeometry(2.5, 0.015, 0.015), lam({ color: 0xcccccc }), -2.25, 2.0, -3.0);
  add(new THREE.BoxGeometry(0.5, 0.55, 0.03), lam({ color: 0x3a62a8 }), -2.7, 1.7, -3.0);
  add(new THREE.BoxGeometry(0.3, 0.7, 0.03), lam({ color: 0x1a1a22 }), -1.8, 1.65, -3.0);
  for (const [x, z, c] of [[-3.2, -2.4, 0x5a6a7a], [-0.6, -2.5, 0x8a8a8a]]) add(new THREE.CylinderGeometry(0.17, 0.14, 0.32, 9), lam({ color: c }), x, 0.16, z);

  // rack grill on legs: coals and sausages, and a dark skull-like lump
  const iron = lam({ color: 0x1a1a18 });
  add(new THREE.BoxGeometry(0.9, 0.18, 0.5), lam({ color: 0x2a2a26 }), 0, 0.6, 0);
  add(new THREE.BoxGeometry(0.8, 0.04, 0.4), lam({ color: 0xd04a14 }), 0, 0.7, 0);
  for (const [x, z] of [[-0.4, -0.2], [0.4, -0.2], [-0.4, 0.2], [0.4, 0.2]]) add(new THREE.BoxGeometry(0.04, 0.6, 0.04), iron, x, 0.3, z);
  for (let i = 0; i < 6; i++) add(new THREE.CylinderGeometry(0.035, 0.035, 0.34, 6), lam({ color: i % 2 ? 0x8a3a24 : 0xb07a50 }), -0.3 + i * 0.12, 0.74, 0, 0, 0, Math.PI / 2);
  add(new THREE.SphereGeometry(0.12, 8, 6), lam({ color: 0x120c08 }), 0.05, 0.84, 0.05);

  // chopping stump with a machete, a bucket and a green bowl
  const stump = add(new THREE.CylinderGeometry(0.28, 0.32, 0.5, 10), lam({ map: woodTexture({ seed: 33, planks: 1, repeat: [1, 1], light: [130, 96, 56] }) }), 1.9, 0.25, 1.1);
  stump.receiveShadow = true;
  add(new THREE.SphereGeometry(0.13, 8, 6), lam({ color: 0x1a0e0a }), 1.9, 0.58, 1.1);
  add(new THREE.BoxGeometry(0.06, 0.02, 0.7), lam({ color: 0xc8ccc4 }), 2.25, 0.52, 1.0, 0, 0.5);
  add(new THREE.CylinderGeometry(0.2, 0.16, 0.32, 10), lam({ color: 0x4a7a3a }), 1.4, 0.16, 1.5);

  // bench with a bowl of something red, blue chair and a tarp over concrete steps
  add(new THREE.BoxGeometry(1.4, 0.06, 0.45), lam({ color: 0x7a5a36 }), -1.8, 0.5, 1.6);
  for (const x of [-2.4, -1.2]) add(new THREE.BoxGeometry(0.06, 0.5, 0.4), lam({ color: 0x5a4226 }), x, 0.25, 1.6);
  add(new THREE.CylinderGeometry(0.2, 0.14, 0.12, 10), lam({ color: 0xa8281c }), -1.8, 0.59, 1.6);
  add(new THREE.BoxGeometry(0.4, 0.04, 0.4), lam({ color: 0x2a62b8 }), -0.6, 0.45, 1.8);
  add(new THREE.BoxGeometry(0.4, 0.4, 0.04), lam({ color: 0x2a62b8 }), -0.6, 0.65, 1.62);
  for (let i = 0; i < 3; i++) add(new THREE.BoxGeometry(1.6, 0.18, 0.5), lam({ color: 0x8a8a84 }), -3.6, 0.09 + i * 0.18, -1.0 - i * 0.4);
  add(new THREE.BoxGeometry(1.6, 0.05, 1.5), lam({ color: 0x2a5ab0 }), -3.6, 0.7, -1.4, 0.4);

  // acoustic guitar leaning on the wall
  add(new THREE.CylinderGeometry(0.17, 0.2, 0.08, 10), lam({ color: 0x9a5a2a }), 0.9, 0.6, -3.4, Math.PI / 2, 0, -0.15);
  add(new THREE.BoxGeometry(0.06, 0.6, 0.03), lam({ color: 0x2a1a10 }), 0.95, 1.1, -3.45, 0, 0, -0.15);

  // a few trees (crossed leaf quads) on the sides
  const mats = [leafCluster(7, [36, 90, 32]), leafCluster(8, [26, 70, 28])]
    .map((t) => psxify(new THREE.MeshBasicMaterial({ map: t, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide, color: 0xb8d8b0 })));
  for (const [x, z] of [[-5, 1], [5, 0], [4.6, 2.6], [-4.6, 3]]) { add(new THREE.CylinderGeometry(0.12, 0.18, 2.6, 6), lam({ color: 0x2a2218 }), x, 1.3, z); for (let i = 0; i < 3; i++) { const q = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2), mats[i & 1]); q.position.set(x, 3 + rnd() * 0.3, z); q.rotation.y = i * 1.1; scene.add(q); } }

  scene.add(new THREE.HemisphereLight(0xb8e0b0, 0x4a5a3a, 5.0));
  const glow = new THREE.PointLight(0xff6a20, 8, 0, 2); glow.position.set(0, 0.9, 0.2); scene.add(glow);
  const moon = new THREE.DirectionalLight(0x90b8a0, 1.0); moon.position.set(-3, 6, 4); scene.add(moon);

  return {
    scene, hotspots: [], setHover() {},
    nodes: {
      grill:   { label: 'GRILL',    pos: [0.1, 1.5, 1.7],  look: [0, 0.6, 0],     fov: 50 },
      pranie:  { label: 'PRANIE',   pos: [-1.8, 1.5, 1.6], look: [-2.2, 1.6, -3], fov: 52 },
      pieniek: { label: 'PIENIEK',  pos: [1.3, 1.3, 2.6],  look: [1.9, 0.4, 1.1], fov: 48 },
      lawa:    { label: 'ŁAWKA',    pos: [-0.4, 1.7, 3.2], look: [-1.8, 0.4, 1.6], fov: 50 },
      schody:  { label: 'SCHODY',   pos: [-1.2, 1.4, 1.0], look: [-3.6, 0.5, -1.2], fov: 55 },
      drabina: { label: 'DRABINA',  pos: [1.2, 1.6, 0.0],  look: [3.0, 1.8, -3.8], fov: 55 },
    },
    startCamera: 'grill',
    update() {},
  };
}
