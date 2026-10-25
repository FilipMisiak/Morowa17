import * as THREE from 'three';
import { psxify } from '../../render/psx.js';
import { mulberry32 } from '../../core/rng.js';
import { leafLitter, leafCluster, redPlanks } from '../../procedural/decor.js';
import { woodTexture } from '../../procedural/textures.js';

/** The back yard (ep07): chain-link fence, a green welded pig-shed, a yellow door to the storeroom with barrels, thick bushes hiding a hatch in the ground. */
export function buildOgrod() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0c1a10);
  scene.fog = new THREE.FogExp2(0x1c3020, 0.07);
  const lam = (o) => psxify(new THREE.MeshLambertMaterial(o));
  const rnd = mulberry32(19);
  const add = (geo, m, x, y, z, ry = 0) => { const me = new THREE.Mesh(geo, m); me.position.set(x, y, z); me.rotation.y = ry; scene.add(me); return me; };

  add(new THREE.PlaneGeometry(30, 30), lam({ map: leafLitter([8, 8]), color: 0x9ab080 }), 0, 0, 0).rotation.x = -Math.PI / 2;

  // house wall (log planks) on the left with a white-barred window
  add(new THREE.BoxGeometry(0.3, 2.8, 8), lam({ map: redPlanks([4, 2]), color: 0xb0a080 }), -3.2, 1.4, -1);
  add(new THREE.BoxGeometry(0.06, 1.0, 1.4), lam({ color: 0xd8d0a0 }), -3.02, 1.5, -2.2);

  // back: green shed wall with a welded green door (the pig-shed) and a yellow storeroom door standing open on barrels
  const green = lam({ color: 0x5a7a58 });
  add(new THREE.BoxGeometry(6, 2.4, 0.2), green, 0, 1.2, -4);
  add(new THREE.BoxGeometry(1.0, 1.9, 0.08), lam({ color: 0x3a6a3a }), -1.6, 0.95, -3.88);
  add(new THREE.BoxGeometry(0.9, 0.05, 0.06), lam({ color: 0x1a1a14 }), -1.6, 1.0, -3.82);     // weld seam
  const yellow = lam({ map: woodTexture({ seed: 8, planks: 4, repeat: [1, 1], dark: [120, 100, 30], light: [190, 160, 60] }) });
  add(new THREE.BoxGeometry(0.9, 1.9, 0.08), yellow, 2.2, 0.95, -3.5, -1.1);                   // door ajar
  const teal = lam({ color: 0x2a7a72 });
  for (const [x, z] of [[0.9, -3.5], [1.4, -3.55], [0.45, -3.6], [1.15, -3.0]]) {
    const b = add(new THREE.CylinderGeometry(0.28, 0.28, 0.8, 10), teal, x, 0.4, z);
    b.castShadow = true;
  }

  // chain-link fence on the right: posts, rails and a thin diagonal mesh
  const wire = lam({ color: 0x4a5448 });
  for (let z = -3.5; z <= 3; z += 1.6) add(new THREE.BoxGeometry(0.08, 1.6, 0.08), lam({ color: 0x3a2c1c }), 3.0, 0.8, z);
  for (const y of [0.2, 0.8, 1.5]) add(new THREE.BoxGeometry(0.03, 0.03, 7), wire, 3.0, y, -0.2);
  for (let z = -3.3; z <= 2.9; z += 0.12) add(new THREE.BoxGeometry(0.015, 1.4, 0.015), wire, 3.0, 0.8, z);

  // bushes (crossed leaf quads) and a round hatch ring in the middle of them
  const mats = [leafCluster(4, [36, 84, 32]), leafCluster(5, [26, 64, 28]), leafCluster(6, [48, 96, 38])]
    .map((t) => psxify(new THREE.MeshBasicMaterial({ map: t, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide, color: 0xc8e0c8 })));
  const bush = (x, z, h) => { for (let i = 0; i < 2; i++) { const q = new THREE.Mesh(new THREE.PlaneGeometry(1.4, h), mats[(i + Math.floor(x)) & 1 ? 0 : 2]); q.position.set(x, h / 2, z); q.rotation.y = rnd() * 3 + i * 1.5; scene.add(q); } };
  for (let i = 0; i < 40; i++) { const x = -1.5 + rnd() * 4.2, z = 0.3 + rnd() * 2.2; if (Math.hypot(x - 0.6, z - 1.8) > 0.8) bush(x, z, 0.5 + rnd() * 0.7); }
  const ring = add(new THREE.TorusGeometry(0.34, 0.05, 6, 14), lam({ color: 0x6a6a5a }), 0.6, 0.06, 1.8); ring.rotation.x = Math.PI / 2;
  add(new THREE.CircleGeometry(0.32, 14), new THREE.MeshBasicMaterial({ color: 0x000000 }), 0.6, 0.05, 1.8).rotation.x = -Math.PI / 2;

  scene.add(new THREE.HemisphereLight(0xb0d0a0, 0x3a4a2a, 3.4));
  const lamp = new THREE.PointLight(0xd8e0a0, 14, 0, 2); lamp.position.set(0.8, 2.2, -2); scene.add(lamp);
  const moon = new THREE.DirectionalLight(0xa0c0b0, 1.0); moon.position.set(-3, 6, 4); scene.add(moon);

  return {
    scene, hotspots: [], setHover() {},
    nodes: {
      brama:   { label: 'PODWÓRKO', pos: [-0.5, 2.1, 4.6], look: [0.4, 1.0, -2.5], fov: 58 },
      schowek: { label: 'SCHOWEK',  pos: [-0.4, 1.5, 0.0], look: [1.2, 0.5, -4.4], fov: 55 },
      krzaki:  { label: 'KRZAKI',   pos: [-0.2, 1.4, 3.9], look: [0.6, 0.1, 1.8], fov: 52 },
    },
    startCamera: 'brama',
    update() {},
  };
}
