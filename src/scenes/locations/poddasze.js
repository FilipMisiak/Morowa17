import * as THREE from 'three';
import { psxify } from '../../render/psx.js';
import { woodTexture } from '../../procedural/textures.js';
import * as P from '../props.js';

/** The real attic (ep08): a pitched roof of boards with rafters, boxes and sacks, dark clothes on a plank, a line of laundry, a yellow hoop, a small bright skylight in the gable. */
export function buildPoddasze() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050604);
  scene.fog = new THREE.FogExp2(0x0c1208, 0.1);
  const lam = (o) => psxify(new THREE.MeshLambertMaterial(o));
  const boards = lam({ map: woodTexture({ seed: 52, planks: 10, repeat: [2, 1], dark: [20, 16, 10], light: [86, 66, 40] }), side: THREE.DoubleSide });
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => { const me = new THREE.Mesh(geo, m); me.position.set(x, y, z); me.rotation.set(rx, ry, rz); me.castShadow = me.receiveShadow = true; scene.add(me); return me; };

  // floor, two roof slopes meeting at a ridge (height 2.6), gable walls
  add(new THREE.PlaneGeometry(3.6, 5), boards, 0, 0, 0, -Math.PI / 2);
  const slope = Math.atan2(2.6, 1.8);
  for (const s of [-1, 1]) add(new THREE.BoxGeometry(Math.hypot(1.8, 2.6), 0.05, 5), boards, s * 0.9, 1.3, 0, 0, 0, -s * slope);
  const tri = new THREE.Shape(); tri.moveTo(-1.8, 0); tri.lineTo(1.8, 0); tri.lineTo(0, 2.6); tri.closePath();
  const gable = lam({ color: 0x3a3020, side: THREE.DoubleSide });
  for (const z of [-2.5, 2.5]) add(new THREE.ShapeGeometry(tri), gable, 0, 0, z);
  // rafters
  const beam = lam({ color: 0x2a1e12 });
  for (let z = -2.2; z <= 2.2; z += 0.9) for (const s of [-1, 1]) {
    const b = add(new THREE.BoxGeometry(0.1, Math.hypot(1.8, 2.6), 0.1), beam, s * 0.9, 1.3, z);
    b.rotation.z = s * Math.atan2(1.8, 2.6);
  }
  add(new THREE.BoxGeometry(0.12, 0.12, 5), beam, 0, 2.6, 0);

  // skylight in the far gable
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.4), new THREE.MeshBasicMaterial({ color: 0xcfe8b0 })); sky.position.set(0, 1.9, -2.48); scene.add(sky);

  // clutter: boxes, sacks, a table with a mug, laundry line, plank with dark clothes, yellow hoop
  for (const [x, z, s] of [[-1.2, -2.0, 0.5], [-0.8, -1.7, 0.4], [1.1, -2.1, 0.55], [-1.3, 0.3, 0.45]]) add(new THREE.BoxGeometry(s, s, s), lam({ color: 0x5a4a30 }), x, s / 2, z);
  for (const [x, z] of [[1.2, -1.2], [1.35, -0.8]]) { const sk = add(new THREE.SphereGeometry(0.28, 8, 6), lam({ color: 0x6a5e3a }), x, 0.25, z); sk.scale.set(1, 1.25, 0.9); }
  const table = P.table(); table.scale.setScalar(0.8); table.position.set(0.7, 0, 1.2); scene.add(table);
  const mug = P.mug(); mug.position.set(0.7, 0.64, 1.2); scene.add(mug);
  add(new THREE.BoxGeometry(0.9, 0.35, 0.5), lam({ color: 0x4a3a22 }), -0.3, 0.17, 1.6);     // chest
  add(new THREE.BoxGeometry(0.95, 0.08, 0.55), lam({ color: 0x2a5a2a }), -0.3, 0.38, 1.6);   // green cloth on it
  add(new THREE.BoxGeometry(1.6, 0.04, 0.2), beam, -1.2, 1.5, 1.2, 0, Math.PI / 2);          // plank on the wall with dark clothes
  for (let i = 0; i < 4; i++) add(new THREE.BoxGeometry(0.22, 0.6, 0.06), lam({ color: i % 2 ? 0x0e0e0c : 0x1a2418 }), -1.2, 1.15, 0.6 + i * 0.25);
  add(new THREE.CylinderGeometry(0.008, 0.008, 3.0, 4), lam({ color: 0x111111 }), 0, 1.9, -0.4, 0, 0, Math.PI / 2);
  for (let i = 0; i < 5; i++) add(new THREE.BoxGeometry(0.2, 0.4, 0.02), lam({ color: [0x9a9a7a, 0x3e5a3a, 0x7a3a2a, 0xb0a070, 0x2a2a28][i] }), -1.1 + i * 0.5, 1.7, -0.4);
  const hoop = add(new THREE.TorusGeometry(0.28, 0.02, 6, 16), lam({ color: 0xc8b020 }), 1.5, 0.6, 0.2, 0.2, 0.4); void hoop;

  scene.add(new THREE.HemisphereLight(0x8aa860, 0x2a3018, 1.2));
  const bulb = new THREE.PointLight(0xe0f0a0, 16, 0, 2); bulb.position.set(0, 2.2, -0.2); scene.add(bulb);

  return {
    scene, hotspots: [], setHover() {},
    nodes: {
      ogolny:  { label: 'STRYCH',  pos: [0.2, 1.5, 2.3],   look: [0, 1.7, -2.4],   fov: 62 },
      ubrania: { label: 'UBRANIA', pos: [0.6, 1.3, 1.4],   look: [-1.4, 1.2, 0.9], fov: 52 },
      skrzynia: { label: 'SKRZYNIA', pos: [0.8, 1.4, 2.2], look: [-0.3, 0.35, 1.6], fov: 55 },
    },
    startCamera: 'ogolny',
    update(t, madness) {
      bulb.intensity = 16 * (0.85 + 0.15 * Math.sin(t * 25)) * (Math.random() < 0.05 + 0.12 * madness ? 0.15 : 1);
    },
  };
}
