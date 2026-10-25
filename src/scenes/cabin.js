import * as THREE from 'three';
import { psxify } from '../render/psx.js';
import { woodTexture, paperSheet } from '../procedural/textures.js';
import { dadoWall } from '../procedural/decor.js';
import * as P from './props.js';
import { CAMERA_NODES } from './cameras.js';

/**
 * The house: one room with recognisable props (see lore/*.md "Wygląd"): olive plaster with a green dado, iron stove in a
 * brick niche, table with a flower cloth, sofa with a zebra blanket, desk with a typewriter, shelves with jars, pictures,
 * a crucifix, a clock, window with curtains and a door with panes.
 * Room: x -2.5..2.5, z -2..2, height 2.6. Hotspots are invisible boxes (outlined in the picture) with userData.hotspot.
 */
export function buildCabin() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050604);
  scene.fog = new THREE.FogExp2(0x10140a, 0.075);

  const mat = (opts) => psxify(new THREE.MeshLambertMaterial(opts));
  const floorMat = mat({ map: woodTexture({ seed: 2, repeat: [3, 3], light: [120, 86, 50] }) });
  const wallMat = mat({ map: dadoWall(4) });
  const ceilMat = mat({ map: woodTexture({ seed: 9, repeat: [3, 2], dark: [24, 18, 12], light: [86, 62, 38] }) });
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
  const place = (obj, pos, ry = 0) => { obj.position.set(...pos); obj.rotation.y = ry; scene.add(obj); return obj; };

  // shell
  add(new THREE.PlaneGeometry(5, 4), floorMat, [0, 0, 0], [-Math.PI / 2, 0, 0]);
  add(new THREE.PlaneGeometry(5, 4), ceilMat, [0, 2.6, 0], [Math.PI / 2, 0, 0]);
  add(new THREE.PlaneGeometry(5, 2.6), wallMat, [0, 1.3, -2]);
  add(new THREE.PlaneGeometry(5, 2.6), wallMat, [0, 1.3, 2], [0, Math.PI, 0]);
  add(new THREE.PlaneGeometry(4, 2.6), wallMat, [-2.5, 1.3, 0], [0, Math.PI / 2, 0]);
  add(new THREE.PlaneGeometry(4, 2.6), wallMat, [2.5, 1.3, 0], [0, -Math.PI / 2, 0]);

  // desk + typewriter + the letter being typed
  place(P.desk(), [-1.6, 0, -1.55]);
  place(P.typewriter(), [-1.6, 0.8, -1.5]);
  add(new THREE.PlaneGeometry(0.3, 0.3), paperMat, [-1.6, 1.08, -1.64], [-0.25, 0, 0]);
  place(P.frame('portrait', 3), [-1.6, 1.75, -1.97]);
  place(P.chair(), [-1.6, 0, -0.85], Math.PI);

  // stove in a brick niche (right of the back wall) with a pot of bigos
  const st = P.stove();
  place(st.group, [1.8, 0, -1.5]);
  const glowMat = st.glow.material;

  // shelf with jars + clock on the back wall
  place(P.shelf(1.3), [0.1, 1.15, -1.86]);
  place(P.clock(), [0.95, 2.1, -1.97]);
  place(P.poster('2016', 0.5, 0.75), [1.75, 1.45, -1.96]);

  // table with a flower cloth, mugs, bottle, chairs
  place(P.table(), [0.3, 0, 0.5]);
  place(P.mug(), [0.0, 0.81, 0.45]); place(P.mug(), [0.65, 0.81, 0.62]);
  place(P.bottle('glass'), [0.35, 0.81, 0.3]);
  const bowl = P.pot(true); bowl.scale.setScalar(0.55); place(bowl, [0.4, 0.81, 0.7]);
  place(P.chair(), [-0.5, 0, 0.5], Math.PI / 2);
  place(P.chair(), [1.1, 0, 0.5], -Math.PI / 2);

  // sofa against the front wall, picture and crucifix on the left wall, wardrobe
  place(P.sofa(), [0.4, 0, 1.55], Math.PI);
  place(P.cabinet(), [-2.2, 0, 0.5], Math.PI / 2);
  place(P.cross(), [-2.47, 1.95, -0.6], Math.PI / 2);
  place(P.frame('landscape', 7, 0.5, 0.36), [-2.47, 1.6, 1.2], Math.PI / 2);

  // door in the right wall near the front
  place(P.door(), [2.46, 0, 1.45], -Math.PI / 2);

  // attic hatch (dark square in the ceiling) with a light frame so it reads as a hatch
  const hatchPivot = new THREE.Group();
  hatchPivot.position.set(0, 2.57, -0.75);
  const hatchDoor = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.9), mat({ color: 0x0a0806 }));
  hatchDoor.position.z = 0.45;
  hatchPivot.add(hatchDoor);
  scene.add(hatchPivot);
  const frameMat = mat({ color: 0x8a6a3a });
  for (const [w, d, x, z] of [[1.1, 0.08, 0, -0.78], [1.1, 0.08, 0, 0.22], [0.08, 1.0, -0.51, -0.28], [0.08, 1.0, 0.51, -0.28]]) add(new THREE.BoxGeometry(w, 0.05, d), frameMat, [x, 2.57, z]);
  add(new THREE.BoxGeometry(0.1, 0.1, 0.1), mat({ color: 0x5a3a1a }), [0.3, 2.5, -0.3]); // pull ring block

  // window in the right wall: pale green "daylight", frame, muntins, curtains
  const win = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), new THREE.MeshBasicMaterial({ color: 0x7c9a58 }));
  win.position.set(2.49, 1.5, 0.4); win.rotation.y = -Math.PI / 2; scene.add(win);
  const wf = mat({ color: 0xcfc9a4 });
  for (const dz of [-0.46, 0, 0.46]) add(new THREE.BoxGeometry(0.05, 0.96, 0.05), wf, [2.46, 1.5, 0.4 + dz]);
  for (const dy of [-0.46, 0, 0.46]) add(new THREE.BoxGeometry(0.05, 0.05, 0.96), wf, [2.46, 1.5 + dy, 0.4]);
  add(new THREE.BoxGeometry(0.16, 0.04, 1.1), wf, [2.42, 1.03, 0.4]);                      // sill
  place(P.curtains(1.3), [2.45, 1.55, 0.4], -Math.PI / 2);

  // lights: one weak bulb on a cord + a dim fill
  scene.add(new THREE.HemisphereLight(0xa8b070, 0x4a3f28, 1.7));
  const bulb = new THREE.PointLight(0xffc77a, 26, 0, 2);
  bulb.position.set(0, 2.1, 0);
  bulb.castShadow = true;
  bulb.shadow.mapSize.set(256, 256);
  scene.add(bulb);
  const bulbMesh = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffd9a0 }));
  bulbMesh.position.copy(bulb.position);
  scene.add(bulbMesh);
  add(new THREE.CylinderGeometry(0.008, 0.008, 0.5, 4), mat({ color: 0x0a0a08 }), [0, 2.35, 0]);

  // hotspots
  const hotspots = [];
  const edgeMats = new Map(); // hotspot id -> outline material (pulses faintly, bright on hover)
  const hot = (id, label, size, pos) => {
    const geo = new THREE.BoxGeometry(...size);
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ visible: false }));
    m.position.set(...pos);
    m.userData.hotspot = { id, label };
    const em = new THREE.LineBasicMaterial({ color: 0xffd070, transparent: true, opacity: 0.08, fog: false, depthTest: false });
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
    scene, hotspots, paper, nodes: CAMERA_NODES, startCamera: 'door',
    setHover(id) { hoverId = id; },
    /** 0 = shut, 1 = wide open (hinged at the back edge). */
    setHatch(open) { hatchPivot.rotation.x = open * 1.1; },
    /** Stove fire 0..1 drives the glow of the fire door. */
    setFire(f) { glowMat.color.setRGB(0.05 + f, 0.02 + f * 0.35, 0.01); },
    /** Called every frame. `t` = stepped clock, `madness` 0..1. Flicker gets worse with madness. */
    update(t, madness, raised = false) {
      for (const [id, em] of edgeMats) em.opacity = raised ? 0 : id === hoverId ? 1 : 0.07 + 0.04 * Math.sin(t * 3);
      const flick = 0.75 + 0.25 * Math.sin(t * 37) * Math.sin(t * 11.3);
      const drop = Math.random() < 0.02 + 0.12 * madness ? 0.15 : 1;
      bulb.intensity = 26 * flick * drop * (1 - 0.55 * madness);
      bulbMesh.material.color.setScalar(0.6 + 0.4 * flick * drop);
    },
  };
}
