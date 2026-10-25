import * as THREE from 'three';
import { psxify } from '../render/psx.js';
import { woodTexture, plasterTexture, rustTexture, paperSheet } from '../procedural/textures.js';

/**
 * Minimal starting cabin built from primitives. Claude Code: extend / replace per episode.
 * Room: x -2.5..2.5, z -2..2, height 2.6. Hotspots are invisible boxes with userData.hotspot = id.
 */
export function buildCabin() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x030302);
  scene.fog = new THREE.FogExp2(0x0b0d06, 0.16);

  const mat = (opts) => psxify(new THREE.MeshLambertMaterial(opts));
  const floorMat = mat({ map: woodTexture({ seed: 2, repeat: [3, 3] }) });
  const wallMat = mat({ map: plasterTexture({ seed: 4, repeat: [2, 1] }) });
  const ceilMat = mat({ map: woodTexture({ seed: 9, repeat: [3, 2], dark: [18, 14, 9], light: [60, 44, 28] }) });
  const darkWood = mat({ map: woodTexture({ seed: 21, planks: 2, repeat: [1, 1] }) });
  const rust = mat({ map: rustTexture() });
  const paper = paperSheet();
  const paperMat = mat({ map: paper.texture });

  const add = (geo, m, pos, rot = [0, 0, 0]) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(...pos);
    mesh.rotation.set(...rot);
    mesh.castShadow = mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
  };

  // shell
  add(new THREE.PlaneGeometry(5, 4), floorMat, [0, 0, 0], [-Math.PI / 2, 0, 0]);
  add(new THREE.PlaneGeometry(5, 4), ceilMat, [0, 2.6, 0], [Math.PI / 2, 0, 0]);
  add(new THREE.PlaneGeometry(5, 2.6), wallMat, [0, 1.3, -2]);
  add(new THREE.PlaneGeometry(5, 2.6), wallMat, [0, 1.3, 2], [0, Math.PI, 0]);
  add(new THREE.PlaneGeometry(4, 2.6), wallMat, [-2.5, 1.3, 0], [0, Math.PI / 2, 0]);
  add(new THREE.PlaneGeometry(4, 2.6), wallMat, [2.5, 1.3, 0], [0, -Math.PI / 2, 0]);

  // desk + typewriter + paper
  add(new THREE.BoxGeometry(1.5, 0.08, 0.7), darkWood, [-1.6, 0.8, -1.5]);
  for (const [dx, dz] of [[-0.7, -0.3], [0.7, -0.3], [-0.7, 0.3], [0.7, 0.3]]) add(new THREE.BoxGeometry(0.08, 0.8, 0.08), darkWood, [-1.6 + dx, 0.4, -1.5 + dz]);
  add(new THREE.BoxGeometry(0.45, 0.16, 0.35), rust, [-1.6, 0.92, -1.5]);
  add(new THREE.PlaneGeometry(0.28, 0.28), paperMat, [-1.6, 1.12, -1.66], [-0.25, 0, 0]);

  // stove + pipe
  add(new THREE.BoxGeometry(0.7, 1.0, 0.7), rust, [1.8, 0.5, -1.5]);
  add(new THREE.CylinderGeometry(0.07, 0.07, 1.6, 6), rust, [1.8, 1.8, -1.5]);
  const glowMat = new THREE.MeshBasicMaterial({ color: 0xff6a20 });
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.2), glowMat); // fire door of the stove
  glow.position.set(1.44, 0.5, -1.5); glow.rotation.y = -Math.PI / 2; scene.add(glow);

  // attic hatch (dark square in the ceiling)
  const hatchPivot = new THREE.Group();
  hatchPivot.position.set(0, 2.57, -0.75);
  const hatchDoor = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.9), mat({ color: 0x0a0806 }));
  hatchDoor.position.z = 0.45;
  hatchPivot.add(hatchDoor);
  scene.add(hatchPivot);
  add(new THREE.BoxGeometry(0.1, 0.1, 0.1), rust, [0.3, 2.5, -0.3]);

  // window (emissive pale green: the only "daylight")
  const win = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), new THREE.MeshBasicMaterial({ color: 0x4a5a3c }));
  win.position.set(2.49, 1.5, 0.4); win.rotation.y = -Math.PI / 2; scene.add(win);

  // couch ("wersalka")
  add(new THREE.BoxGeometry(1.8, 0.45, 0.8), darkWood, [0.4, 0.22, 1.5]);

  // lights: one weak bulb + almost nothing else
  scene.add(new THREE.HemisphereLight(0x303a22, 0x050403, 0.8));
  const bulb = new THREE.PointLight(0xffc77a, 16, 0, 2);
  bulb.position.set(0, 2.2, 0);
  bulb.castShadow = true;
  bulb.shadow.mapSize.set(256, 256);
  scene.add(bulb);
  const bulbMesh = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffd9a0 }));
  bulbMesh.position.copy(bulb.position);
  scene.add(bulbMesh);

  // hotspots
  const hotspots = [];
  const edgeMats = new Map(); // hotspot id -> outline material (pulses faintly, bright on hover)
  const hot = (id, label, size, pos) => {
    const geo = new THREE.BoxGeometry(...size);
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ visible: false }));
    m.position.set(...pos);
    m.userData.hotspot = { id, label };
    const em = new THREE.LineBasicMaterial({ color: 0xffd070, transparent: true, opacity: 0.3, fog: false, depthTest: false });
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), em);
    edges.renderOrder = 10;
    m.add(edges);
    edgeMats.set(id, em);
    scene.add(m);
    hotspots.push(m);
  };
  hot('desk', 'BIURKO — kliknij, by pisać pismo', [1.6, 0.8, 0.8], [-1.6, 0.95, -1.5]);
  hot('hatch', 'WŁAZ NA STRYCH — wybierz KŁÓDKĘ i kliknij', [1.0, 0.4, 1.0], [0, 2.5, -0.3]);
  hot('stove', 'PIEC — wybierz WĘGIEL i kliknij', [0.8, 1.2, 0.8], [1.8, 0.6, -1.5]);
  hot('window', 'OKNO — wybierz PRZYSMAK i kliknij', [0.3, 1.0, 1.0], [2.4, 1.5, 0.4]);

  let hoverId = null;
  return {
    scene, hotspots, paper,
    setHover(id) { hoverId = id; },
    /** 0 = shut, 1 = wide open (hinged at the back edge). */
    setHatch(open) { hatchPivot.rotation.x = open * 1.1; },
    /** Stove fire 0..1 drives the glow of the fire door. */
    setFire(f) { glowMat.color.setRGB(0.05 + f, 0.02 + f * 0.35, 0.01); },
    /** Called every frame. `t` = stepped clock, `madness` 0..1. Flicker gets worse with madness. */
    update(t, madness, raised = false) {
      for (const [id, em] of edgeMats) em.opacity = raised ? 0 : id === hoverId ? 1 : 0.22 + 0.1 * Math.sin(t * 3);
      const flick = 0.75 + 0.25 * Math.sin(t * 37) * Math.sin(t * 11.3);
      const drop = Math.random() < 0.02 + 0.12 * madness ? 0.15 : 1;
      bulb.intensity = 16 * flick * drop * (1 - 0.55 * madness);
      bulbMesh.material.color.setScalar(0.6 + 0.4 * flick * drop);
    },
  };
}
