import * as THREE from 'three';
import { psxify } from '../../render/psx.js';
import { woodTexture } from '../../procedural/textures.js';

/** Night exteriors of ep15: the industrial hall (roof trusses, long nave, dusty floor) and the brick tower with a small lit house. */
export function buildHala() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a4a28);
  scene.fog = new THREE.FogExp2(0x1a4a22, 0.045);
  const lam = (o) => psxify(new THREE.MeshLambertMaterial(o));
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => { const me = new THREE.Mesh(geo, m); me.position.set(x, y, z); me.rotation.set(rx, ry, rz); scene.add(me); return me; };

  // hall: long nave along -z, floor, side walls, trusses
  add(new THREE.PlaneGeometry(8, 40), lam({ map: woodTexture({ seed: 61, planks: 4, repeat: [1, 1], dark: [30, 34, 26], light: [70, 76, 56] }) }), 0, 0, -14, -Math.PI / 2);
  const wall = lam({ color: 0x3a463a });
  add(new THREE.BoxGeometry(0.3, 6, 40), wall, -4, 3, -14); add(new THREE.BoxGeometry(0.3, 6, 40), wall, 4, 3, -14);
  const iron = lam({ color: 0x1a1e18 });
  for (let z = 0; z > -32; z -= 3) {
    add(new THREE.BoxGeometry(8, 0.14, 0.14), iron, 0, 5.4, z);
    add(new THREE.BoxGeometry(4.4, 0.1, 0.1), iron, -2, 5.9, z, 0, 0, 0.28); add(new THREE.BoxGeometry(4.4, 0.1, 0.1), iron, 2, 5.9, z, 0, 0, -0.28);
    add(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshBasicMaterial({ color: 0xc8f0a0 }), 0, 5.2, z);
  }

  // brick tower and a small lit house, off to the side of the hall (seen from the 'wieza' camera)
  add(new THREE.BoxGeometry(2, 9, 2), lam({ color: 0x6a3a2a }), 14, 4.5, -8);
  add(new THREE.BoxGeometry(5, 2.5, 3), lam({ color: 0x5a3224 }), 9, 1.25, -9);
  add(new THREE.BoxGeometry(1.4, 1.1, 1.2), lam({ color: 0x8a7a5a }), 5, 0.55, -2);
  add(new THREE.BoxGeometry(0.4, 0.4, 0.05), new THREE.MeshBasicMaterial({ color: 0xffd070 }), 5, 0.7, -1.38);
  add(new THREE.PlaneGeometry(80, 80), lam({ color: 0x1c3a1e }), 8, -0.05, -8, -Math.PI / 2);

  scene.add(new THREE.HemisphereLight(0xa0f0b0, 0x406a48, 5.2));
  return {
    scene, hotspots: [], setHover() {},
    nodes: {
      hala:  { label: 'HALA',  pos: [0, 1.6, 2.0],   look: [0, 2.6, -20], fov: 60 },
      wieza: { label: 'WIEŻA', pos: [0.5, 1.2, 4.0], look: [11, 3.0, -8], fov: 58 },
    },
    startCamera: 'hala',
    update() {},
  };
}
