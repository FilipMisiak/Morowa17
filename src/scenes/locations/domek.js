import * as THREE from 'three';
import { psxify } from '../../render/psx.js';
import { woodTexture } from '../../procedural/textures.js';
import { brickTexture } from '../../procedural/decor.js';
import * as P from '../props.js';

/** Inside the "domek strachów" (ep16): a hallway with a checkered floor, a WC, a jacket on a hook, a brick stove with a flowered pot and a shelf with a pale doll. */
export function buildDomek() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0e08);
  scene.fog = new THREE.FogExp2(0x1a2414, 0.09);
  const lam = (o) => psxify(new THREE.MeshLambertMaterial(o));
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => { const me = new THREE.Mesh(geo, m); me.position.set(x, y, z); me.rotation.set(rx, ry, rz); me.castShadow = me.receiveShadow = true; scene.add(me); return me; };

  // checkered floor (canvas)
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d');
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g.fillStyle = (i + j) % 2 ? '#14120a' : '#b89a2a'; g.fillRect(i * 8, j * 8, 8, 8); }
  const ft = new THREE.CanvasTexture(c); ft.magFilter = THREE.NearestFilter; ft.wrapS = ft.wrapT = THREE.RepeatWrapping; ft.repeat.set(5, 5);
  add(new THREE.PlaneGeometry(4, 5), lam({ map: ft }), 0, 0, 0, -Math.PI / 2);
  add(new THREE.PlaneGeometry(4, 5), lam({ map: woodTexture({ seed: 71, planks: 6, repeat: [1, 1], dark: [20, 16, 10], light: [60, 48, 30] }) }), 0, 2.4, 0, Math.PI / 2);
  // walls: lower half green paint, upper beige; back wall brick with the stove
  const lower = lam({ color: 0x3a6a3a }), upper = lam({ color: 0xb8a878 });
  for (const [w, x, z, ry] of [[4, 0, -2.5, 0], [5, -2, 0, Math.PI / 2], [5, 2, 0, -Math.PI / 2], [4, 0, 2.5, Math.PI]]) {
    add(new THREE.PlaneGeometry(w, 1.1), lower, x, 0.55, z, 0, ry); add(new THREE.PlaneGeometry(w, 1.3), upper, x, 1.75, z, 0, ry);
  }
  add(new THREE.PlaneGeometry(4, 2.4), lam({ map: brickTexture([3, 2]), color: 0x8a8a70 }), 0, 1.2, -2.48);

  // brick stove with a hood and a flowered pot
  add(new THREE.BoxGeometry(1.2, 1.0, 0.7), lam({ map: brickTexture([1, 1]), color: 0x9a6a50 }), -0.6, 0.5, -2.1);
  add(new THREE.BoxGeometry(1.0, 0.7, 0.5), lam({ color: 0x2a2220 }), -0.6, 1.5, -2.2);
  const pot = P.pot(false); pot.position.set(-0.6, 1.0, -2.1); pot.scale.setScalar(0.8); scene.add(pot);
  // door with four panes and a jacket, WC, shelf with a pale doll and buckets
  const door = P.door(); door.position.set(1.4, 0, -2.45); scene.add(door);
  add(new THREE.BoxGeometry(0.3, 0.5, 0.05), lam({ color: 0xd0c8a8 }), -1.9, 1.4, -1.2);
  add(new THREE.BoxGeometry(0.4, 0.4, 0.5), lam({ color: 0xf0f0e8 }), 1.7, 0.2, 1.4);
  add(new THREE.BoxGeometry(1.0, 0.05, 0.4), lam({ color: 0x7a5a36 }), -1.7, 1.4, 1.2);
  add(new THREE.SphereGeometry(0.1, 8, 6), lam({ color: 0xf4f0e0 }), -1.7, 1.6, 1.2); add(new THREE.CylinderGeometry(0.08, 0.11, 0.26, 8), lam({ color: 0xf4f0e0 }), -1.7, 1.48, 1.2);
  for (const x of [-1.95, -1.5]) add(new THREE.CylinderGeometry(0.15, 0.12, 0.25, 8), lam({ color: 0x8a8e90 }), x, 0.13, 1.2);
  // window with a bucket under it
  add(new THREE.PlaneGeometry(0.8, 1.2), new THREE.MeshBasicMaterial({ color: 0xe8f0d8 }), 1.97, 1.5, -0.2, 0, -Math.PI / 2);
  add(new THREE.CylinderGeometry(0.2, 0.16, 0.3, 8), lam({ color: 0xc8c8b8 }), 1.7, 0.15, -0.2);

  scene.add(new THREE.HemisphereLight(0x90b080, 0x2a3a20, 2.4));
  const bulb = new THREE.PointLight(0xe0d890, 16, 0, 2); bulb.position.set(0, 2.1, 0); scene.add(bulb);
  return {
    scene, hotspots: [], setHover() {},
    nodes: {
      przedpokoj: { label: 'PRZEDPOKÓJ', pos: [-0.2, 1.5, 2.2], look: [1.4, 1.0, -2], fov: 62 },
      pokoj:      { label: 'POKÓJ',      pos: [-0.6, 1.5, -0.6], look: [1.9, 1.2, -0.2], fov: 58 },
      piec:       { label: 'PIEC',       pos: [0.2, 0.9, 0.8],  look: [-0.6, 1.1, -2.1], fov: 52 },
      lalka:      { label: 'LALKA',      pos: [-0.2, 1.5, -0.6], look: [-1.7, 1.5, 1.2], fov: 48 },
    },
    startCamera: 'przedpokoj',
    update() {},
  };
}
