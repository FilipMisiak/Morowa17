import * as THREE from 'three';
import { psxify } from '../../render/psx.js';
import { mulberry32 } from '../../core/rng.js';
import { leafLitter } from '../../procedural/decor.js';

/** Painted panel of the "domek strachów" entrance: a grinning devil on the left, a smiling blonde on the right, green sky with golden stars. */
function panelTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 128;
  const x = c.getContext('2d');
  x.fillStyle = '#2a7a50'; x.fillRect(0, 0, 256, 128);
  x.fillStyle = '#e8c850'; const r = mulberry32(7); for (let i = 0; i < 30; i++) x.fillRect(r() * 256, r() * 128, 3, 3);
  // devil
  x.fillStyle = '#a82a20'; x.beginPath(); x.ellipse(64, 70, 40, 46, 0, 0, 7); x.fill();
  x.beginPath(); x.moveTo(34, 40); x.lineTo(24, 6); x.lineTo(52, 30); x.fill(); x.beginPath(); x.moveTo(94, 40); x.lineTo(104, 6); x.lineTo(76, 30); x.fill();
  x.fillStyle = '#f0e8c0'; x.beginPath(); x.ellipse(64, 92, 26, 12, 0, 0, 7); x.fill();
  x.fillStyle = '#e8d020'; x.fillRect(46, 56, 12, 6); x.fillRect(70, 56, 12, 6);
  // blonde
  x.fillStyle = '#e8c040'; x.beginPath(); x.ellipse(192, 64, 42, 56, 0, 0, 7); x.fill();
  x.fillStyle = '#e8b898'; x.beginPath(); x.ellipse(192, 70, 30, 38, 0, 0, 7); x.fill();
  x.fillStyle = '#b02030'; x.beginPath(); x.ellipse(192, 88, 14, 6, 0, 0, 7); x.fill();
  x.fillStyle = '#2a2a20'; x.fillRect(178, 60, 8, 4); x.fillRect(198, 60, 8, 4);
  const t = new THREE.CanvasTexture(c); t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter; return t;
}

/** The night fair of ep16: carousel with a green disc and a silver bear, a bouncy castle, a kids' train, an ice-cream booth, a prize stall and the "domek strachów" house behind an iron fence. */
export function buildFestyn() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2a5a40);
  scene.fog = new THREE.FogExp2(0x3a7050, 0.04);
  const lam = (o) => psxify(new THREE.MeshLambertMaterial(o));
  const basic = (o) => new THREE.MeshBasicMaterial(o);
  const rnd = mulberry32(61);
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => { const me = new THREE.Mesh(geo, m); me.position.set(x, y, z); me.rotation.set(rx, ry, rz); scene.add(me); return me; };

  add(new THREE.PlaneGeometry(60, 60), lam({ map: leafLitter([14, 14]), color: 0x90c070 }), 0, 0, 0, -Math.PI / 2);

  // carousel: striped roof, green disc balloon, silver bear on top
  add(new THREE.CylinderGeometry(0.1, 0.1, 2.4, 6), lam({ color: 0xcccccc }), -3, 1.2, -2);
  add(new THREE.ConeGeometry(1.8, 0.9, 12), lam({ color: 0xc8302a }), -3, 2.8, -2);
  add(new THREE.CylinderGeometry(1.3, 1.3, 0.12, 14), lam({ color: 0x28a050 }), -3, 0.3, -2);
  add(new THREE.SphereGeometry(0.28, 8, 6), lam({ color: 0xc8ccd0 }), -3, 3.4, -2);
  // bouncy castle: red box with white towers
  add(new THREE.BoxGeometry(2.6, 1.2, 2.2), lam({ color: 0xc8302a }), 3.4, 0.6, -3);
  for (const x of [2.4, 3.4, 4.4]) add(new THREE.CylinderGeometry(0.3, 0.3, 1.2, 8), lam({ color: 0xf0f0e8 }), x, 1.7, -3.8);
  // kids' train: three coloured wagons
  [0x28a050, 0xe8c030, 0x3a62c8].forEach((c, i) => add(new THREE.BoxGeometry(0.9, 0.5, 0.5), lam({ color: c }), 0.4 + i * 1.0, 0.35, -1.2));
  // ice-cream booth and a prize stall with plush animals
  add(new THREE.BoxGeometry(1.2, 1.6, 0.9), lam({ color: 0xe8e0c0 }), -1.4, 0.8, -3.6);
  for (let i = 0; i < 4; i++) add(new THREE.SphereGeometry(0.12, 6, 5), lam({ color: [0xf0e0b0, 0xe890a0, 0x90c8e8, 0xe8c050][i] }), -1.7 + i * 0.2, 1.7, -3.55);
  add(new THREE.BoxGeometry(1.8, 0.9, 0.7), lam({ color: 0x3a8a4a }), 1.6, 0.45, -3.8);
  for (let i = 0; i < 6; i++) add(new THREE.SphereGeometry(0.17, 6, 5), lam({ color: 0xc8a070 }), 0.9 + i * 0.28, 1.05, -3.8);

  // the house: dark gabled body with three yellow windows, iron fence in front, bare trees; entrance panel to the left of it
  add(new THREE.BoxGeometry(5, 2.4, 3), lam({ color: 0x4a2a1c }), 3.6, 1.2, 4.6);
  for (let i = 0; i < 3; i++) add(new THREE.BoxGeometry(0.6, 0.8, 0.05), basic({ color: 0xf0d060 }), 2.4 + i * 1.2, 1.5, 3.07);
  add(new THREE.BoxGeometry(5.4, 0.1, 3.4), lam({ color: 0x2a1c14 }), 3.6, 2.8, 4.6, 0.5);
  const bar = lam({ color: 0x14180e });
  for (let x = 0.5; x <= 6.5; x += 0.22) add(new THREE.BoxGeometry(0.03, 1.2, 0.03), bar, x, 0.6, 2.6);
  add(new THREE.BoxGeometry(6.2, 0.05, 0.05), bar, 3.6, 1.1, 2.6);
  add(new THREE.PlaneGeometry(3.2, 1.6), basic({ map: panelTexture() }), -0.4, 1.4, 2.8);
  // cars behind
  for (const [x, c] of [[-4, 0x6a1a1a], [-5.4, 0x2a3a5a]]) add(new THREE.BoxGeometry(1.8, 0.6, 0.9), lam({ color: c }), x, 0.4, 3.4);

  // fairground light bulbs
  for (let i = 0; i < 16; i++) add(new THREE.SphereGeometry(0.05, 5, 4), basic({ color: [0xffe080, 0x80ffa0, 0xff8070][i % 3] }), -5 + i * 0.7, 2.6 + rnd() * 0.4, -4.4);

  scene.add(new THREE.HemisphereLight(0xc0f0c8, 0x4a6a48, 5.0));
  const sun = new THREE.DirectionalLight(0xe0f0c0, 1.0); sun.position.set(-3, 6, 4); scene.add(sun);

  return {
    scene, hotspots: [], setHover() {},
    nodes: {
      karuzela: { label: 'KARUZELA', pos: [0, 1.6, 2.4],  look: [-3, 1.2, -2], fov: 52 },
      zamek:    { label: 'ZAMEK',    pos: [-0.6, 1.6, 2.4], look: [3.4, 1.0, -3], fov: 52 },
      lody:     { label: 'LODY',     pos: [0.4, 1.5, 1.0],  look: [-0.6, 1.0, -3.7], fov: 50 },
      domek:    { label: 'DOMEK',    pos: [1.0, 1.5, -1.0], look: [3.4, 1.4, 4.0], fov: 55 },
      panel:    { label: 'WEJŚCIE',  pos: [-0.4, 1.4, -0.4], look: [-0.4, 1.4, 2.8], fov: 40 },
      parking:  { label: 'PARKING',  pos: [2.0, 1.6, -0.5], look: [-3, 0.8, 3.4], fov: 55 },
    },
    startCamera: 'karuzela',
    update() {},
  };
}
