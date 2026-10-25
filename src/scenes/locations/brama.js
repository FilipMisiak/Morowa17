import * as THREE from 'three';
import { psxify } from '../../render/psx.js';
import { leafLitter, roofTiles } from '../../procedural/decor.js';

/** The street gate (ep18): a blue wrought-iron gate in a green fence, a white house with a brown tiled roof, red paving stones, a neighbour's fence and trees. */
export function buildBrama() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x6a8a70);
  scene.fog = new THREE.FogExp2(0x7a9a7c, 0.035);
  const lam = (o) => psxify(new THREE.MeshLambertMaterial(o));
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => { const me = new THREE.Mesh(geo, m); me.position.set(x, y, z); me.rotation.set(rx, ry, rz); scene.add(me); return me; };

  add(new THREE.PlaneGeometry(60, 60), lam({ map: leafLitter([14, 14]), color: 0x98b080 }), 0, 0, 0, -Math.PI / 2);
  // red paving in front of the gate and the street
  add(new THREE.PlaneGeometry(6, 8), lam({ color: 0xa04a3a }), 0, 0.01, 3, -Math.PI / 2);
  add(new THREE.PlaneGeometry(40, 5), lam({ color: 0x4a4c4a }), 0, 0.012, 9.5, -Math.PI / 2);

  // fence: green posts and bars, blue gate with a scroll
  const green = lam({ color: 0x2e5a34 }), blue = lam({ color: 0x2a58b8 });
  for (let x = -5; x <= 5; x += 0.2) { if (Math.abs(x) < 1.1) continue; add(new THREE.BoxGeometry(0.03, 1.5, 0.03), green, x, 0.75, 0); }
  add(new THREE.BoxGeometry(3.8, 0.05, 0.05), green, -3.1, 1.3, 0); add(new THREE.BoxGeometry(3.8, 0.05, 0.05), green, 3.1, 1.3, 0);
  for (let x = -1.0; x <= 1.0; x += 0.14) add(new THREE.BoxGeometry(0.03, 1.7, 0.03), blue, x, 0.85, 0.02);
  add(new THREE.BoxGeometry(2.2, 0.06, 0.06), blue, 0, 1.6, 0.02); add(new THREE.BoxGeometry(2.2, 0.06, 0.06), blue, 0, 0.4, 0.02);
  add(new THREE.TorusGeometry(0.3, 0.02, 4, 12), blue, 0, 1.0, 0.02);
  for (const x of [-1.15, 1.15]) add(new THREE.BoxGeometry(0.16, 1.9, 0.16), lam({ color: 0x8a8a80 }), x, 0.95, 0);

  // house behind the fence: white walls, brown tiled gable roof
  add(new THREE.BoxGeometry(7, 2.8, 4), lam({ color: 0xe0dccc }), 0, 1.4, -4);
  const roof = lam({ map: roofTiles([5, 2]), color: 0xb08060, side: THREE.DoubleSide });
  add(new THREE.BoxGeometry(7.6, 0.12, 3.2), roof, 0, 3.5, -3.0, 0.7); add(new THREE.BoxGeometry(7.6, 0.12, 3.2), roof, 0, 3.5, -5.0, -0.7);
  for (const x of [-2, 2]) add(new THREE.BoxGeometry(1.0, 1.1, 0.05), new THREE.MeshBasicMaterial({ color: 0x3a4a40 }), x, 1.5, -1.98);
  // trees
  for (const [x, z] of [[-6, -2], [6, -3], [-7, 3], [8, 2]]) { add(new THREE.CylinderGeometry(0.14, 0.2, 3, 6), lam({ color: 0x3a2c1c }), x, 1.5, z); add(new THREE.SphereGeometry(1.5, 8, 6), lam({ color: 0x4a8a44 }), x, 3.6, z); }
  // a bicycle leaning on the fence
  const bike = lam({ color: 0x20203a });
  for (const x of [3.2, 4.1]) add(new THREE.TorusGeometry(0.32, 0.025, 4, 12), bike, x, 0.34, 1.0, 0, Math.PI / 2);
  add(new THREE.BoxGeometry(0.9, 0.03, 0.03), bike, 3.65, 0.6, 1.0);

  scene.add(new THREE.HemisphereLight(0xe0f4d8, 0x6a7a58, 5.0));
  const sun = new THREE.DirectionalLight(0xfff0d0, 1.4); sun.position.set(-3, 6, 6); scene.add(sun);
  return {
    scene, hotspots: [], setHover() {},
    nodes: {
      brama: { label: 'BRAMA', pos: [0.2, 1.6, 4.6], look: [0, 1.1, 0], fov: 52 },
      ulica: { label: 'ULICA', pos: [-3.0, 1.6, 6.0], look: [3.5, 0.8, 0.5], fov: 55 },
    },
    startCamera: 'brama',
    update() {},
  };
}
