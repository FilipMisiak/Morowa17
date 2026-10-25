import * as THREE from 'three';
import { psxify } from '../../render/psx.js';
import { woodTexture } from '../../procedural/textures.js';
import { dadoWall } from '../../procedural/decor.js';
import * as P from '../props.js';

/** The attic room of ep04: green walls, a map in a frame, a zebra-blanket sofa with a long dark case, posters and a diploma. */
export function buildStrych() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x040603);
  scene.fog = new THREE.FogExp2(0x0c1208, 0.1);
  const lam = (o) => psxify(new THREE.MeshLambertMaterial(o));
  const add = (geo, m, x, y, z, rx = 0, ry = 0) => { const me = new THREE.Mesh(geo, m); me.position.set(x, y, z); me.rotation.set(rx, ry, 0); me.castShadow = me.receiveShadow = true; scene.add(me); return me; };

  // shell: x -2..2, z -1.6..1.6, height 2.3
  add(new THREE.PlaneGeometry(4, 3.2), lam({ map: woodTexture({ seed: 44, planks: 8, repeat: [1, 1], dark: [14, 16, 10], light: [58, 62, 36] }) }), 0, 0, 0, -Math.PI / 2);
  add(new THREE.PlaneGeometry(4, 3.2), lam({ color: 0x2a3220 }), 0, 2.3, 0, Math.PI / 2);
  const wall = lam({ map: dadoWall(14), color: 0x9ab080 });
  add(new THREE.PlaneGeometry(4, 2.3), wall, 0, 1.15, -1.6);
  add(new THREE.PlaneGeometry(3.2, 2.3), wall, -2, 1.15, 0, 0, Math.PI / 2);
  add(new THREE.PlaneGeometry(3.2, 2.3), wall, 2, 1.15, 0, 0, -Math.PI / 2);
  add(new THREE.PlaneGeometry(4, 2.3), wall, 0, 1.15, 1.6, 0, Math.PI);

  // back wall: the map in its frame, a lamp on a cord
  const map = P.frame('landscape', 7, 0.9, 0.7); map.position.set(-0.7, 1.45, -1.58); scene.add(map);
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.7, 4), lam({ color: 0x111111 })); cord.position.set(0.5, 1.95, -0.6); scene.add(cord);

  // zebra sofa with a long dark case (rifle or instrument case) behind it
  const sofa = P.sofa(); sofa.position.set(-0.2, 0, -1.1); scene.add(sofa);
  const long = add(new THREE.BoxGeometry(1.1, 0.12, 0.14), lam({ color: 0x0a0a08 }), -0.6, 1.05, -1.4); long.rotation.z = 0.05;
  const pot = add(new THREE.CylinderGeometry(0.1, 0.08, 0.22, 8), lam({ color: 0x4a3a20 }), -1.65, 0.11, -1.3); pot.scale.set(1, 1, 1);

  // left wall: the poster wall — diploma, a picture of a house, two posters of men in suits
  const dip = P.frame('landscape', 3, 0.42, 0.3); dip.position.set(-1.98, 1.65, 0.1); dip.rotation.y = Math.PI / 2; scene.add(dip);
  for (const [z, seed] of [[-0.6, 5], [0.8, 9]]) { const p = P.frame('portrait', seed, 0.36, 0.5); p.position.set(-1.98, 1.3, z); p.rotation.y = Math.PI / 2; scene.add(p); }
  const big = P.frame('landscape', 11, 0.8, 0.5); big.position.set(-1.98, 1.7, 1.1); big.rotation.y = Math.PI / 2; scene.add(big);

  const ord = P.poster('orzadek', 0.18, 0.54); ord.position.set(-1.97, 1.25, -1.0); ord.rotation.y = Math.PI / 2; scene.add(ord);
  const y16 = P.poster('2016', 0.4, 0.6); y16.position.set(-1.97, 1.25, 0.35); y16.rotation.y = Math.PI / 2; scene.add(y16);

  // right wall: a family portrait in a gilt frame, withered roses under it (ep07)
  const gilt = P.frame('portrait', 13, 0.7, 0.9); gilt.position.set(1.98, 1.5, -0.7); gilt.rotation.y = -Math.PI / 2; scene.add(gilt);
  const roses = P.bottle('green'); roses.position.set(1.8, 0.0, -0.7); scene.add(roses);
  for (let i = 0; i < 3; i++) { const r = add(new THREE.SphereGeometry(0.05, 6, 5), lam({ color: 0x4a0c0c }), 1.75 + i * 0.02, 0.5 + i * 0.07, -0.78 + i * 0.07); void r; }

  // table with the milk bottle and the green mug
  const table = P.table(); table.position.set(1.0, 0, 0.2); scene.add(table);
  const bottle = P.bottle('green'); bottle.position.set(0.9, 0.78, 0.2); scene.add(bottle);
  const mug = P.mug(); mug.position.set(1.15, 0.78, 0.35); scene.add(mug);

  scene.add(new THREE.HemisphereLight(0x8aa860, 0x2a3018, 1.3));
  const bulb = new THREE.PointLight(0xc8e090, 18, 0, 2); bulb.position.set(0.5, 1.95, -0.6); scene.add(bulb);
  const bulbMesh = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), new THREE.MeshBasicMaterial({ color: 0xe0f0a0 })); bulbMesh.position.copy(bulb.position); scene.add(bulbMesh);

  return {
    scene, hotspots: [], setHover() {},
    nodes: {
      sofa:   { label: 'KANAPA',  pos: [0.9, 1.35, 0.9],  look: [-0.5, 1.0, -1.3], fov: 50 },
      plakaty: { label: 'PLAKATY', pos: [1.0, 1.4, 0.4],  look: [-2, 1.4, 0.2],   fov: 55 },
      portret: { label: 'PORTRET', pos: [0.4, 1.5, -0.7], look: [2, 1.5, -0.7], fov: 45 },
      stol:   { label: 'STÓŁ',    pos: [-0.2, 1.4, 1.3],  look: [1.0, 0.85, 0.2], fov: 50 },
    },
    startCamera: 'sofa',
    /** The bare bulb sways and flickers harder with madness. */
    update(t, madness) {
      bulb.intensity = 18 * (0.85 + 0.15 * Math.sin(t * 27)) * (Math.random() < 0.05 + 0.12 * madness ? 0.15 : 1);
    },
  };
}
