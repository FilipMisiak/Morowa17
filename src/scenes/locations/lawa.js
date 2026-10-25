import * as THREE from 'three';
import { psxify } from '../../render/psx.js';
import { woodTexture } from '../../procedural/textures.js';

/** The room with the yellow wall (ep13 finale): olive-yellow wall, wooden lattice, a barrel, silver / red / green buckets, a crate and a bench. */
export function buildLawa() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x303018);
  scene.fog = new THREE.FogExp2(0x3a3a1c, 0.06);
  const lam = (o) => psxify(new THREE.MeshLambertMaterial(o));
  const add = (geo, m, x, y, z, rx = 0, ry = 0) => { const me = new THREE.Mesh(geo, m); me.position.set(x, y, z); me.rotation.set(rx, ry, 0); me.castShadow = me.receiveShadow = true; scene.add(me); return me; };

  add(new THREE.PlaneGeometry(6, 5), lam({ map: woodTexture({ seed: 51, planks: 5, repeat: [1, 1], dark: [40, 34, 20], light: [90, 78, 46] }) }), 0, 0, 0, -Math.PI / 2);
  add(new THREE.PlaneGeometry(6, 5), lam({ color: 0x20200e }), 0, 2.6, 0, Math.PI / 2);
  add(new THREE.PlaneGeometry(6, 2.6), lam({ color: 0xa89a30 }), 0, 1.3, -2.5);
  // wooden lattice behind
  const slat = lam({ color: 0x6a5430 });
  for (let x = -2.6; x <= 2.6; x += 0.24) add(new THREE.BoxGeometry(0.05, 2.2, 0.04), slat, x, 1.2, -2.42);
  for (const y of [0.4, 1.2, 2.0]) add(new THREE.BoxGeometry(5.4, 0.05, 0.05), slat, 0, y, -2.4);
  // barrel and buckets
  add(new THREE.CylinderGeometry(0.34, 0.34, 0.9, 12), lam({ color: 0x5a6a5a }), -2.0, 0.45, -1.8);
  add(new THREE.CylinderGeometry(0.2, 0.15, 0.3, 10), lam({ color: 0xc8cccc }), -1.3, 0.15, -1.9);
  add(new THREE.CylinderGeometry(0.2, 0.15, 0.3, 10), lam({ color: 0xb02a20 }), 2.0, 0.15, -1.9);
  add(new THREE.CylinderGeometry(0.2, 0.15, 0.3, 10), lam({ color: 0x3a8a3a }), 2.5, 0.15, -1.6);
  add(new THREE.BoxGeometry(0.8, 0.5, 0.5), lam({ color: 0x7a6038 }), 1.4, 0.25, -1.9);
  // bench in front of the wall
  add(new THREE.BoxGeometry(1.8, 0.07, 0.5), lam({ color: 0x8a6a40 }), 0, 0.5, -1.2);
  for (const x of [-0.8, 0.8]) add(new THREE.BoxGeometry(0.07, 0.5, 0.42), lam({ color: 0x6a4e2c }), x, 0.25, -1.2);

  scene.add(new THREE.HemisphereLight(0xe8e0a0, 0x4a4020, 3.6));
  const lamp = new THREE.PointLight(0xffe8a0, 14, 0, 2); lamp.position.set(0, 2.3, -0.4); scene.add(lamp);

  return {
    scene, hotspots: [], setHover() {},
    nodes: {
      lawa:   { label: 'ŁAWA',   pos: [0.0, 1.3, 1.4], look: [0, 0.8, -1.6], fov: 52 },
      blizej: { label: 'BLIŻEJ', pos: [0.0, 1.2, 0.2], look: [0, 0.9, -1.4], fov: 40 },
    },
    startCamera: 'lawa',
    update() {},
  };
}
