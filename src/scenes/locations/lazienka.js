import * as THREE from 'three';
import { psxify } from '../../render/psx.js';
import { woodTexture } from '../../procedural/textures.js';
import { tileTexture, dadoWall } from '../../procedural/decor.js';
import * as P from '../props.js';

/** The bathroom (ep03): a tub with something dark and alive in it, a counter with a mug, bottles, a black bag and a crumpled cloth. */
export function buildLazienka() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050604);
  scene.fog = new THREE.FogExp2(0x10140a, 0.09);
  const lam = (o) => psxify(new THREE.MeshLambertMaterial(o));
  const add = (geo, m, x, y, z, rx = 0, ry = 0) => { const me = new THREE.Mesh(geo, m); me.position.set(x, y, z); me.rotation.set(rx, ry, 0); me.castShadow = me.receiveShadow = true; scene.add(me); return me; };

  // shell: x -1.5..1.5, z -1.3..1.3, height 2.4
  add(new THREE.PlaneGeometry(3, 2.6), lam({ map: woodTexture({ seed: 31, planks: 6, repeat: [1, 1], dark: [16, 14, 10], light: [60, 52, 36] }) }), 0, 0, 0, -Math.PI / 2);
  add(new THREE.PlaneGeometry(3, 2.6), lam({ map: tileTexture([3, 2.6]) }), 0, 2.4, 0, Math.PI / 2);
  const tiles = lam({ map: tileTexture([3, 1.5]) }), upper = lam({ map: dadoWall(9) });
  add(new THREE.PlaneGeometry(3, 1.4), tiles, 0, 0.7, -1.3);
  add(new THREE.PlaneGeometry(3, 1.0), upper, 0, 1.9, -1.3);
  add(new THREE.PlaneGeometry(2.6, 1.4), tiles, -1.5, 0.7, 0, 0, Math.PI / 2);
  add(new THREE.PlaneGeometry(2.6, 1.0), upper, -1.5, 1.9, 0, 0, Math.PI / 2);
  add(new THREE.PlaneGeometry(2.6, 2.4), upper, 1.5, 1.2, 0, 0, -Math.PI / 2);
  add(new THREE.PlaneGeometry(3, 2.4), upper, 0, 1.2, 1.3, 0, Math.PI);

  // tub along the back wall with a dark living mass inside
  const enamel = lam({ color: 0xd4d4c0 });
  const tub = new THREE.Group();
  const tb = (w, h, d, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), enamel); m.position.set(x, y, z); tub.add(m); };
  tb(1.7, 0.55, 0.08, 0, 0.3, 0.34); tb(1.7, 0.55, 0.08, 0, 0.3, -0.34); tb(0.08, 0.55, 0.7, -0.81, 0.3, 0); tb(0.08, 0.55, 0.7, 0.81, 0.3, 0); tb(1.7, 0.06, 0.7, 0, 0.1, 0);
  tub.position.set(0.2, 0, -0.9); scene.add(tub);
  const mass = new THREE.Group();
  const flesh = lam({ color: 0x3a1a12 });
  for (const [x, y, z, s] of [[0, 0.22, 0, 0.3], [0.28, 0.2, 0.05, 0.22], [-0.3, 0.19, -0.04, 0.2], [0.1, 0.3, -0.08, 0.16], [-0.1, 0.28, 0.1, 0.14]]) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(s, 8, 6), flesh); m.position.set(x, y, z); m.scale.set(1.2, 0.7, 1); mass.add(m);
  }
  mass.position.set(0.2, 0.2, -0.9); scene.add(mass);
  const tap = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3, 6), lam({ color: 0x8a8a80 })); tap.position.set(0.2, 0.9, -1.2); tap.rotation.z = Math.PI / 2; scene.add(tap);

  // counter on the left with the stuff from frames 00:34 / 00:58
  add(new THREE.BoxGeometry(0.55, 0.85, 1.1), lam({ color: 0x6a5a40 }), -1.2, 0.425, 0.2);
  const mug = P.mug(); mug.position.set(-1.25, 0.85, -0.15); scene.add(mug);
  for (const [x, z, c] of [[-1.1, 0.0, 'glass'], [-1.2, 0.1, 'green'], [-1.05, 0.2, 'glass']]) { const b = P.bottle(c); b.position.set(x, 0.85, z); scene.add(b); }
  const bag = add(new THREE.SphereGeometry(0.22, 8, 6), lam({ color: 0x0b0b0a }), -1.2, 1.0, 0.5); bag.scale.set(1, 0.8, 1.1);
  const cloth = add(new THREE.SphereGeometry(0.18, 7, 5), lam({ color: 0x3e5a3a }), -1.15, 0.95, 0.75); cloth.scale.set(1.3, 0.5, 1);
  const banner = P.poster('polska', 0.9, 0.28); banner.position.set(0.9, 1.9, -1.28); scene.add(banner);
  const flag = P.poster('stadion', 0.5, 0.34); flag.position.set(1.48, 1.0, 0.7); flag.rotation.y = -Math.PI / 2; scene.add(flag);
  const win = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.6), new THREE.MeshBasicMaterial({ color: 0x4a6a40 })); win.position.set(1.49, 1.6, -0.3); win.rotation.y = -Math.PI / 2; scene.add(win);

  scene.add(new THREE.HemisphereLight(0x9aa870, 0x3a3020, 1.5));
  const bulb = new THREE.PointLight(0xffd890, 22, 0, 2); bulb.position.set(0, 2.1, 0); scene.add(bulb);
  const bulbMesh = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffe0a0 })); bulbMesh.position.copy(bulb.position); scene.add(bulbMesh);

  return {
    scene, hotspots: [], setHover() {},
    nodes: {
      wanna: { label: 'WANNA', pos: [0.9, 1.7, 1.0], look: [0.2, 0.4, -0.9], fov: 55 },
      blat:  { label: 'BLAT',  pos: [-0.2, 1.5, 1.1], look: [-1.2, 0.9, 0.2], fov: 52 },
      izba:  { label: 'KAFLE', pos: [0.6, 1.45, 0.9], look: [-1.5, 1.3, -0.3], fov: 50 },
      twarz: { label: 'TWARZ', pos: [-0.5, 0.5, 0.5], look: [-1.0, 1.75, -0.5], fov: 55 },
    },
    startCamera: 'wanna',
    /** The mass in the tub breathes on the stepped clock; the bulb flickers more with madness. */
    update(t, madness) {
      const k = 1 + Math.sin(t * 2.2) * 0.05;
      mass.scale.set(k, 1 + (k - 1) * 1.6, k);
      bulb.intensity = 22 * (0.8 + 0.2 * Math.sin(t * 31)) * (Math.random() < 0.04 + 0.1 * madness ? 0.2 : 1);
    },
  };
}
