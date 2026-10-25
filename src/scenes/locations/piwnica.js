import * as THREE from 'three';
import { psxify } from '../../render/psx.js';
import { woodTexture } from '../../procedural/textures.js';
import { brickTexture } from '../../procedural/decor.js';
import * as P from '../props.js';

/** The cellar of ep05: brick walls, wooden stairs going up, shelves of jars ("uszka"), one red thing on the top shelf. */
export function buildPiwnica() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x030403);
  scene.fog = new THREE.FogExp2(0x0a1008, 0.12);
  const lam = (o) => psxify(new THREE.MeshLambertMaterial(o));
  const add = (geo, m, x, y, z, rx = 0, ry = 0) => { const me = new THREE.Mesh(geo, m); me.position.set(x, y, z); me.rotation.set(rx, ry, 0); me.castShadow = me.receiveShadow = true; scene.add(me); return me; };

  // shell: x -1.8..1.8, z -2..2, height 2.2
  const brick = lam({ map: brickTexture([3, 2]), color: 0x8a9a78 });
  add(new THREE.PlaneGeometry(3.6, 4), lam({ color: 0x1c1a14 }), 0, 0, 0, -Math.PI / 2);
  add(new THREE.PlaneGeometry(3.6, 4), lam({ color: 0x1a1a14 }), 0, 2.2, 0, Math.PI / 2);
  add(new THREE.PlaneGeometry(3.6, 2.2), brick, 0, 1.1, -2);
  add(new THREE.PlaneGeometry(4, 2.2), brick, -1.8, 1.1, 0, 0, Math.PI / 2);
  add(new THREE.PlaneGeometry(4, 2.2), brick, 1.8, 1.1, 0, 0, -Math.PI / 2);
  add(new THREE.PlaneGeometry(3.6, 2.2), brick, 0, 1.1, 2, 0, Math.PI);

  // back wall: shelves with jars, one red object on top
  for (const x of [-0.8, 0.8]) { const s = P.shelf(1.5); s.position.set(x, 0.9, -1.85); scene.add(s); const s2 = P.shelf(1.5); s2.position.set(x, 0.3, -1.85); scene.add(s2); }
  const red = add(new THREE.BoxGeometry(0.14, 0.12, 0.1), lam({ color: 0x8a1c14 }), 0.3, 1.45, -1.8);
  void red;

  // wooden stairs on the right wall rising toward +z, and an open door at the end of the passage
  const wood = lam({ map: woodTexture({ seed: 61, planks: 2, repeat: [1, 1], dark: [20, 14, 8], light: [70, 50, 30] }) });
  for (let i = 0; i < 6; i++) add(new THREE.BoxGeometry(0.9, 0.06, 0.3), wood, 1.3, 0.2 + i * 0.28, 1.9 - i * 0.3);
  const door = P.door(); door.position.set(-1.78, 0, 0.4); door.rotation.y = Math.PI / 2; scene.add(door);

  // small table with a bowl
  const crate = add(new THREE.BoxGeometry(0.6, 0.5, 0.6), wood, -0.4, 0.25, 0.8);
  const bowl = P.pot(true); bowl.position.set(-0.4, 0.5, 0.8); bowl.scale.setScalar(0.7); scene.add(bowl);
  void crate;

  scene.add(new THREE.HemisphereLight(0x7a9a60, 0x2a2a18, 1.0));
  const bulb = new THREE.PointLight(0xe0c080, 14, 0, 2); bulb.position.set(0, 2.0, 0); scene.add(bulb);
  const bulbMesh = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffe0a0 })); bulbMesh.position.copy(bulb.position); scene.add(bulbMesh);

  return {
    scene, hotspots: [], setHover() {},
    nodes: {
      schody:   { label: 'SCHODY',  pos: [-1.2, 1.9, -1.3], look: [1.3, 0.7, 1.4], fov: 70 },
      korytarz: { label: 'DRZWI',   pos: [1.2, 1.5, 1.4],   look: [-1.8, 1.1, 0.4],  fov: 58 },
      polki:    { label: 'PÓŁKI',   pos: [0.0, 1.4, 0.2],   look: [0, 0.9, -1.85],   fov: 50 },
      twarz:    { label: 'TWARZ',   pos: [0.0, 0.45, 0.3],  look: [0, 1.75, -1.0],   fov: 58 },
    },
    startCamera: 'polki',
    /** The bare bulb swings a little and flickers with madness. */
    update(t, madness) {
      bulb.position.x = Math.sin(t * 1.3) * 0.12;
      bulbMesh.position.x = bulb.position.x;
      bulb.intensity = 14 * (0.85 + 0.15 * Math.sin(t * 23)) * (Math.random() < 0.04 + 0.12 * madness ? 0.15 : 1);
    },
  };
}
