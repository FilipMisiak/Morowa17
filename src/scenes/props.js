import * as THREE from 'three';
import { psxify } from '../render/psx.js';
import { woodTexture, rustTexture } from '../procedural/textures.js';
import {
  flowerCloth, zebraFabric, pictureTexture, keysTexture, curtainTexture, doorTexture, jarsTexture, brickTexture, posterTexture,
} from '../procedural/decor.js';

/** Recognisable props built from primitives. Every builder returns a Group with its origin on the floor. */
const lam = (o) => psxify(new THREE.MeshLambertMaterial(o));
const basic = (o) => new THREE.MeshBasicMaterial(o);
const box = (g, w, h, d, m, x, y, z, rx = 0) => {
  const me = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); me.position.set(x, y, z); me.rotation.x = rx; me.castShadow = me.receiveShadow = true; g.add(me); return me;
};
const cyl = (g, rt, rb, h, m, x, y, z, seg = 10) => {
  const me = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m); me.position.set(x, y, z); me.castShadow = me.receiveShadow = true; g.add(me); return me;
};

let cache = null;
const mats = () => cache ??= {
  wood: lam({ map: woodTexture({ seed: 21, planks: 2, repeat: [1, 1], light: [120, 84, 46] }) }),
  woodLight: lam({ map: woodTexture({ seed: 5, planks: 3, repeat: [1, 1], light: [150, 110, 62] }) }),
  rust: lam({ map: rustTexture() }),
  iron: lam({ color: 0x5a584a }),
  enamel: lam({ color: 0xcfd0b8 }),
  enamelDark: lam({ color: 0x2f4a3c }),
  green: lam({ color: 0x3d6b3a }),
  glass: lam({ color: 0x5a8a3c }),
  bigos: lam({ color: 0x6a2e1a }),
  cloth: lam({ map: flowerCloth() }),
  zebra: lam({ map: zebraFabric() }),
  pillow: lam({ color: 0x4e7a3a }),
  brick: lam({ map: brickTexture([1.4, 1.4]) }),
  keys: lam({ map: keysTexture() }),
  curtain: lam({ map: curtainTexture(), side: THREE.DoubleSide }),
  door: lam({ map: doorTexture() }),
  jars: basic({ map: jarsTexture() }),
  cream: lam({ color: 0xd6cfae }),
  black: lam({ color: 0x0c0b08 }),
};

export function table() {
  const m = mats(), g = new THREE.Group();
  box(g, 1.3, 0.06, 0.8, m.cloth, 0, 0.78, 0);
  box(g, 1.34, 0.03, 0.84, m.cloth, 0, 0.74, 0);
  for (const [x, z] of [[-0.6, -0.35], [0.6, -0.35], [-0.6, 0.35], [0.6, 0.35]]) box(g, 0.07, 0.72, 0.07, m.wood, x, 0.36, z);
  return g;
}

export function chair() {
  const m = mats(), g = new THREE.Group();
  box(g, 0.42, 0.05, 0.42, m.woodLight, 0, 0.46, 0);
  for (const [x, z] of [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]]) box(g, 0.04, 0.44, 0.04, m.woodLight, x, 0.22, z);
  box(g, 0.42, 0.4, 0.04, m.woodLight, 0, 0.72, -0.2);
  for (const x of [-0.12, 0, 0.12]) box(g, 0.03, 0.34, 0.03, m.wood, x, 0.72, -0.2);
  return g;
}

/** Enamelled cooking pot with a ladle; `bigos` fills it with dark stew. */
export function pot(bigos = true) {
  const m = mats(), g = new THREE.Group();
  cyl(g, 0.17, 0.15, 0.24, m.enamelDark, 0, 0.12, 0, 12);
  cyl(g, 0.175, 0.175, 0.025, m.iron, 0, 0.245, 0, 12);
  if (bigos) cyl(g, 0.15, 0.15, 0.02, m.bigos, 0, 0.235, 0, 12);
  for (const s of [-1, 1]) box(g, 0.07, 0.03, 0.03, m.iron, s * 0.2, 0.2, 0);
  box(g, 0.02, 0.02, 0.4, m.iron, 0.05, 0.36, 0.0, 0.5);                    // ladle handle
  return g;
}

export function mug() {
  const m = mats(), g = new THREE.Group();
  cyl(g, 0.045, 0.04, 0.1, m.enamel, 0, 0.05, 0, 10);
  box(g, 0.03, 0.05, 0.015, m.enamel, 0.06, 0.055, 0);
  return g;
}

export function bottle(color = 'glass') {
  const m = mats(), g = new THREE.Group();
  cyl(g, 0.04, 0.04, 0.2, m[color], 0, 0.1, 0, 8);
  cyl(g, 0.016, 0.03, 0.08, m[color], 0, 0.24, 0, 8);
  return g;
}

/** "Wersalka": sofa with a green pillow and a zebra-print blanket. */
export function sofa() {
  const m = mats(), g = new THREE.Group();
  box(g, 1.9, 0.38, 0.85, m.wood, 0, 0.2, 0);
  box(g, 1.8, 0.14, 0.78, m.zebra, 0, 0.44, 0.02);
  box(g, 1.9, 0.62, 0.16, m.wood, 0, 0.62, -0.36);
  box(g, 0.14, 0.34, 0.85, m.wood, -0.98, 0.32, 0);
  box(g, 0.14, 0.34, 0.85, m.wood, 0.98, 0.32, 0);
  box(g, 0.5, 0.14, 0.3, m.pillow, -0.6, 0.58, -0.15, -0.5);
  return g;
}

/** Wall shelf with a row of preserve jars. */
export function shelf(w = 1.4) {
  const m = mats(), g = new THREE.Group();
  box(g, w, 0.04, 0.26, m.wood, 0, 0, 0);
  const jars = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.95, w * 0.95 * 0.25), m.jars);
  jars.position.set(0, w * 0.95 * 0.125 + 0.02, 0.1); g.add(jars);
  box(g, w, 0.04, 0.26, m.wood, 0, 0.5, 0);
  const jars2 = jars.clone(); jars2.position.y += 0.5; g.add(jars2);
  return g;
}

export function frame(kind = 'portrait', seed = 1, w = 0.34, h = 0.42) {
  const m = mats(), g = new THREE.Group();
  box(g, w + 0.06, h + 0.06, 0.03, m.black, 0, 0, 0);
  const pic = new THREE.Mesh(new THREE.PlaneGeometry(w, h), basic({ map: pictureTexture(kind, seed), color: 0xb0b0a0 }));
  pic.position.z = 0.02; g.add(pic);
  return g;
}

/** Flat poster / banner (see decor.posterTexture): '2016' | 'orzadek' | 'polska' | 'stadion'. */
export function poster(kind = '2016', w = 0.5, h = 0.75) {
  const g = new THREE.Group();
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), basic({ map: posterTexture(kind), color: 0xb8b8a8 }));
  g.add(m);
  return g;
}

/** Crucifix on a dark plaque (ep03 frame). */
export function cross() {
  const m = mats(), g = new THREE.Group();
  box(g, 0.26, 0.32, 0.03, m.black, 0, 0, 0);
  box(g, 0.04, 0.2, 0.03, m.cream, 0, 0.26, 0.01); box(g, 0.14, 0.04, 0.03, m.cream, 0, 0.3, 0.01);
  return g;
}

export function clock() {
  const m = mats(), g = new THREE.Group();
  cyl(g, 0.17, 0.17, 0.05, m.black, 0, 0, 0, 14).rotation.x = Math.PI / 2;
  const face = cyl(g, 0.14, 0.14, 0.02, m.cream, 0, 0, 0.03, 14); face.rotation.x = Math.PI / 2;
  box(g, 0.012, 0.1, 0.01, m.black, 0, 0.04, 0.045); box(g, 0.08, 0.012, 0.01, m.black, 0.03, 0, 0.045);
  return g;
}

export function curtains(h = 1.3) {
  const m = mats(), g = new THREE.Group();
  for (const s of [-1, 1]) { const c = new THREE.Mesh(new THREE.PlaneGeometry(0.35, h), m.curtain); c.position.set(s * 0.5, 0, 0); g.add(c); }
  box(g, 1.3, 0.03, 0.04, m.wood, 0, h / 2 + 0.02, 0);
  return g;
}

export function door() {
  const m = mats(), g = new THREE.Group();
  box(g, 0.92, 2.04, 0.08, m.black, 0, 1.02, 0);
  const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.96), m.door); leaf.position.set(0, 1.0, 0.05); g.add(leaf);
  box(g, 0.05, 0.05, 0.05, m.iron, 0.32, 0.95, 0.09);
  return g;
}

/** Iron stove in a brick niche with a pot on top and a glowing fire door; returns { group, glow }. */
export function stove() {
  const m = mats(), g = new THREE.Group();
  const niche = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 2.3), m.brick); niche.position.set(0, 1.15, -0.34); g.add(niche);
  box(g, 0.72, 0.95, 0.62, m.iron, 0, 0.475, 0);
  box(g, 0.76, 0.05, 0.66, m.rust, 0, 0.97, 0);
  for (const x of [-0.14, 0.14]) cyl(g, 0.09, 0.09, 0.01, m.black, x, 1.0, 0.0, 12);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.2), basic({ color: 0xff6a20 }));
  glow.position.set(0, 0.45, 0.32); g.add(glow);
  box(g, 0.36, 0.26, 0.02, m.iron, 0, 0.45, 0.315).renderOrder = -1;
  cyl(g, 0.07, 0.07, 1.4, m.rust, 0.18, 1.7, -0.15);
  const p = pot(true); p.position.set(-0.14, 0.99, 0); g.add(p);
  return { group: g, glow };
}

export function typewriter() {
  const m = mats(), g = new THREE.Group();
  box(g, 0.42, 0.1, 0.34, m.iron, 0, 0.05, 0);
  const k = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.17), m.keys); k.rotation.x = -1.1; k.position.set(0, 0.13, 0.08); g.add(k);
  box(g, 0.4, 0.08, 0.1, m.iron, 0, 0.16, -0.12);
  box(g, 0.44, 0.03, 0.03, m.black, 0, 0.21, -0.12);      // carriage rail
  return g;
}

export function desk() {
  const m = mats(), g = new THREE.Group();
  box(g, 1.5, 0.07, 0.7, m.wood, 0, 0.76, 0);
  for (const [x, z] of [[-0.7, -0.3], [0.7, -0.3], [-0.7, 0.3], [0.7, 0.3]]) box(g, 0.07, 0.76, 0.07, m.wood, x, 0.38, z);
  box(g, 1.3, 0.2, 0.6, m.woodLight, 0, 0.6, 0);
  return g;
}

export function cabinet() {
  const m = mats(), g = new THREE.Group();
  box(g, 0.9, 1.9, 0.5, m.wood, 0, 0.95, 0);
  box(g, 0.02, 1.8, 0.02, m.black, 0, 0.95, 0.26);
  for (const x of [-0.06, 0.06]) box(g, 0.03, 0.12, 0.03, m.cream, x, 0.95, 0.27);
  return g;
}

export function rug() {
  const m = mats();
  const r = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.3), m.zebra); r.rotation.x = -Math.PI / 2; r.position.y = 0.012; return r;
}

export function ladder() {
  const m = mats(), g = new THREE.Group();
  for (const x of [-0.18, 0.18]) box(g, 0.04, 1.6, 0.04, m.wood, x, 0.8, 0);
  for (let i = 0; i < 6; i++) box(g, 0.36, 0.03, 0.03, m.wood, 0, 0.2 + i * 0.26, 0);
  return g;
}
