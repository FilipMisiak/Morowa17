import * as THREE from 'three';
import { psxify } from '../../render/psx.js';
import { mulberry32 } from '../../core/rng.js';
import { leafLitter, leafCluster, reserveSign } from '../../procedural/decor.js';

/** Forest of the nature reserve (ep02, ep08): dense blue-green dusk, a sign post, logs, undergrowth. */
export function buildLas() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x07100c);
  scene.fog = new THREE.FogExp2(0x10261c, 0.055);
  const lam = (o) => psxify(new THREE.MeshLambertMaterial(o));
  const rnd = mulberry32(77);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), lam({ map: leafLitter() }));
  ground.rotation.x = -Math.PI / 2; scene.add(ground);

  // trunks around a clearing; crossed leaf quads as crowns and undergrowth
  const bark = lam({ color: 0x2a2418 });
  const crowns = [leafCluster(1, [38, 86, 34]), leafCluster(2, [28, 66, 30]), leafCluster(3, [50, 96, 40])];
  const leafMats = crowns.map((t) => psxify(new THREE.MeshBasicMaterial({ map: t, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide, color: 0xc8e0c8 })));
  const quad = (x, y, z, s, m) => {
    for (let i = 0; i < 2; i++) { const q = new THREE.Mesh(new THREE.PlaneGeometry(s, s), m); q.position.set(x, y, z); q.rotation.y = rnd() * 3 + i * 1.5; scene.add(q); }
  };
  for (let i = 0; i < 70; i++) {
    const a = rnd() * Math.PI * 2, d = 4 + rnd() * 14, x = Math.cos(a) * d, z = Math.sin(a) * d - 2, h = 4 + rnd() * 3, r = 0.07 + rnd() * 0.13;
    const t = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.7, r, h, 6), bark); t.position.set(x, h / 2, z); scene.add(t);
    for (let k = 0; k < 4; k++) quad(x + (rnd() - 0.5) * 1.2, h * (0.55 + rnd() * 0.45), z + (rnd() - 0.5) * 1.2, 1.6 + rnd() * 1.4, leafMats[k % 3]);
  }
  for (let i = 0; i < 90; i++) quad((rnd() - 0.5) * 22, 0.25 + rnd() * 0.5, (rnd() - 0.5) * 22 - 2, 0.9 + rnd() * 0.9, leafMats[i % 3]);

  // sign post with a little roof
  const sign = new THREE.Group();
  const post = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.0, 0.1), lam({ color: 0x2a1e14 })); post.position.y = 1.0; sign.add(post);
  const board = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.7), new THREE.MeshBasicMaterial({ map: reserveSign(), color: 0xf0f4e8 })); board.position.set(0, 1.75, 0.07); sign.add(board);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 0.3), lam({ color: 0x3a2c1c })); roof.position.set(0, 2.15, 0.05); sign.add(roof);
  sign.position.set(-0.8, 0, -2.5); scene.add(sign);

  // felled logs on the right and a stump
  for (let i = 0; i < 4; i++) {
    const l = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 2.4, 8), lam({ color: 0x3a3020 }));
    l.rotation.z = Math.PI / 2; l.rotation.y = 0.4 + i * 0.15; l.position.set(2.4 + i * 0.1, 0.17 + (i % 2) * 0.3, -2 - i * 0.2); scene.add(l);
  }
  const stump = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.5, 8), lam({ color: 0x3a3020 })); stump.position.set(0.9, 0.25, 0.2); scene.add(stump);

  // ep08 00:07: an empty wooden frame lying on the leaves
  const rama = new THREE.Group();
  for (const [w, d, x, z] of [[1.0, 0.08, 0, -0.46], [1.0, 0.08, 0, 0.46], [0.08, 0.84, -0.46, 0], [0.08, 0.84, 0.46, 0]]) { const b = new THREE.Mesh(new THREE.BoxGeometry(w, 0.06, d), lam({ color: 0xb8a878, emissive: 0x3a3420 })); b.position.set(x, 0, z); rama.add(b); }
  rama.position.set(1.6, 0.05, 1.6); rama.rotation.y = 0.5; scene.add(rama);

  scene.add(new THREE.HemisphereLight(0x8abaa0, 0x2a3a24, 2.6));
  const moon = new THREE.DirectionalLight(0x9ab8c8, 0.9); moon.position.set(-3, 6, 4); scene.add(moon);

  return {
    scene, hotspots: [], setHover() {},
    nodes: {
      znak:   { label: 'TABLICA', pos: [-0.2, 1.45, 1.8], look: [-0.8, 1.6, -2.5], fov: 55 },
      polana: { label: 'POLANA',  pos: [0.4, 1.5, 3.2],   look: [0.6, 1.0, -1.0], fov: 58 },
      rama:   { label: 'RAMA',    pos: [1.6, 2.2, 1.9], look: [1.6, 0.0, 1.6], fov: 55 },
      kloda:  { label: 'KŁODA',   pos: [-0.6, 1.2, 1.9],  look: [1.0, 0.5, 0.0],  fov: 52 },
    },
    startCamera: 'znak',
    update() {},
  };
}
