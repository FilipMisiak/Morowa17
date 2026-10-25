import * as THREE from 'three';
import { psxify } from '../../render/psx.js';
import { mulberry32 } from '../../core/rng.js';
import { redPlanks, roofTiles, leafLitter } from '../../procedural/decor.js';

/** The house from outside at dusk (ep01 opening, ep02): red clapboard, gabled roof, chimney, dormer, fence, bare trees. */
export function buildPodworko() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x7a8070);
  scene.fog = new THREE.FogExp2(0x5a6050, 0.035);
  const lam = (o) => psxify(new THREE.MeshLambertMaterial(o));
  const rnd = mulberry32(5);
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => { const me = new THREE.Mesh(geo, m); me.position.set(x, y, z); me.rotation.set(rx, ry, rz); scene.add(me); return me; };

  add(new THREE.PlaneGeometry(60, 60), lam({ map: leafLitter([14, 14]), color: 0x8a9a70 }), 0, 0, 0, -Math.PI / 2);

  // house body (front faces +z) and gabled roof
  add(new THREE.BoxGeometry(7, 2.7, 4.5), lam({ map: redPlanks([4, 2]) }), 0, 1.35, -3);
  const roofM = lam({ map: roofTiles([5, 2]), side: THREE.DoubleSide });
  add(new THREE.BoxGeometry(7.6, 0.12, 3.4), roofM, 0, 3.6, -1.6, 0.72);
  add(new THREE.BoxGeometry(7.6, 0.12, 3.4), roofM, 0, 3.6, -4.4, -0.72);
  add(new THREE.BoxGeometry(0.5, 1.3, 0.5), lam({ color: 0x4a2a20 }), 2.2, 4.1, -3.4);                       // chimney
  const win = lam({ color: 0xd8d0a0 });
  const glass = new THREE.MeshBasicMaterial({ color: 0x2a2e1a });
  for (const x of [-2.2, 0.5]) { add(new THREE.BoxGeometry(1.1, 1.2, 0.06), win, x, 1.5, -0.73); add(new THREE.BoxGeometry(0.9, 1.0, 0.07), glass, x, 1.5, -0.72); add(new THREE.BoxGeometry(0.04, 1.0, 0.08), win, x, 1.5, -0.7); }
  add(new THREE.BoxGeometry(0.7, 0.9, 0.06), win, 0, 3.5, -2.2); add(new THREE.BoxGeometry(0.55, 0.75, 0.07), glass, 0, 3.5, -2.18); // dormer
  add(new THREE.BoxGeometry(1.1, 2.0, 0.08), lam({ color: 0x5a3a1a }), 2.6, 1.0, -0.72);                      // door

  // fence of vertical bars
  const bar = lam({ color: 0x1a2418 });
  for (let x = -5; x <= 5; x += 0.22) add(new THREE.BoxGeometry(0.03, 1.4, 0.03), bar, x, 0.7, 1.6);
  add(new THREE.BoxGeometry(10.2, 0.05, 0.05), bar, 0, 1.25, 1.6); add(new THREE.BoxGeometry(10.2, 0.05, 0.05), bar, 0, 0.3, 1.6);

  // bare trees: trunk + recursive branches
  const wood = lam({ color: 0x2a2218 });
  const branch = (x, y, z, len, rad, ang, depth) => {
    const g = new THREE.CylinderGeometry(rad * 0.6, rad, len, 5); g.translate(0, len / 2, 0);
    const m = new THREE.Mesh(g, wood); m.position.set(x, y, z); m.rotation.set((rnd() - 0.5) * ang, rnd() * 6, (rnd() - 0.5) * ang); scene.add(m);
    if (depth > 0) {
      const tip = new THREE.Vector3(0, len, 0).applyEuler(m.rotation).add(m.position);
      for (let i = 0; i < 3; i++) branch(tip.x, tip.y, tip.z, len * 0.72, rad * 0.6, 1.3, depth - 1);
    }
  };
  for (const [x, z] of [[-4.5, 0], [-6.5, -3], [5.2, -1], [7, -4]]) branch(x, 0, z, 2.4, 0.16, 0.2, 3);

  scene.add(new THREE.HemisphereLight(0xc8d0b0, 0x2a3018, 1.6));
  return {
    scene, hotspots: [], setHover() {},
    nodes: {
      front: { label: 'DOM',  pos: [0.4, 1.55, 8.5], look: [0.3, 2.3, -2], fov: 52 },
      plot:  { label: 'PŁOT', pos: [-3, 1.5, 6],     look: [1, 1.2, 0],    fov: 55 },
    },
    startCamera: 'front',
    update() {},
  };
}
