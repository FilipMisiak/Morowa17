import * as THREE from 'three';
import { psxify } from '../render/psx.js';
import { state } from '../core/state.js';
import { bus } from '../core/bus.js';
import { createSprite } from './characters/sprite.js';
import { visemeOf } from './characters/draw.js';
import kononDef from './characters/konon.js';
import majorDef from './characters/major.js';
import goscDef from './characters/gosc.js';
import zoltyDef from './characters/zolty.js';
import meczennikDef from './characters/meczennik.js';
import maskaDef from './characters/maska.js';
import brazowyDef from './characters/brazowy.js';
import tape2Defs from './characters/tasma2.js';

const LOOK = new THREE.Vector3();

/**
 * Konon and Major (drawn 2D sprites) and the anomalies (primitives).
 * Everything is parked behind the wall until an episode places it.
 */
export function buildActors(scene) {
  const lambert = (color) => psxify(new THREE.MeshLambertMaterial({ color }));
  const ents = {};

  const register = (id, group, anomaly, head) => {
    group.visible = false;
    group.position.set(0, 0, -9);
    scene.add(group);
    ents[id] = { group, anomaly, walk: null, head };
  };

  // Konon and Major are drawn 2D sprites (billboards) with animated faces; the mouth follows the typed subtitle.
  const sprites = {};
  const character = (def) => {
    const sp = createSprite(def);
    const g = new THREE.Group();
    g.add(sp.mesh);
    const head = new THREE.Object3D(); head.position.y = def.height * 0.78; g.add(head);
    register(def.id, g, false, head);
    ents[def.id].sprite = sp;
    sprites[def.id] = sp;
  };
  character(kononDef);
  character(majorDef);
  character(goscDef);
  character(zoltyDef);
  character(meczennikDef);
  character(maskaDef);
  character(brazowyDef);
  tape2Defs.forEach(character);
  const ALIAS = { gospodarz: 'konon', wspollokator: 'major' };
  bus.on('speak:char', ({ speaker, ch }) => sprites[ALIAS[speaker] ?? speaker]?.mouth(visemeOf(ch), state.time));

  // Strych's shade: tall, flat, black, two pale eyes. Looking at it through the lens costs sanity.
  const shade = new THREE.Group();
  const slab = new THREE.Mesh(new THREE.BoxGeometry(0.55, 2.1, 0.08), new THREE.MeshBasicMaterial({ color: 0x000000 }));
  slab.position.y = 1.05;
  shade.add(slab);
  for (const dx of [-0.1, 0.1]) {
    const eye = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.03), new THREE.MeshBasicMaterial({ color: 0xc8d890 }));
    eye.position.set(dx, 1.75, 0.05);
    shade.add(eye);
  }
  register('shade', shade, true, slab);

  // Dog behind the window: a low black shape on the yard side.
  const dogGroup = new THREE.Group();
  const dog = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 0.4), new THREE.MeshBasicMaterial({ color: 0x050403 }));
  dog.position.y = 0.3;
  dogGroup.add(dog);
  register('dog', dogGroup, true, dog);

  return {
    ents,
    /** Moves every actor into another scene (location change). */
    attach(newScene) { for (const e of Object.values(ents)) newScene.add(e.group); },
    place(id, x, z, face = 0, y = 0) {
      const e = ents[id];
      if (!e) return;
      e.group.position.set(x, y, z);
      e.group.rotation.y = face;
      e.group.visible = true;
      e.walk = null;
      e.lie = false; e.sprite?.lie(false);
    },
    /** Lays the sprite on its side (on a sofa) or stands it up again. */
    lie(id, on = true) { if (ents[id]) { ents[id].lie = on; ents[id].sprite?.lie(on); } },
    show(id, on = true) { if (ents[id]) ents[id].group.visible = on; },
    walk(id, x, z, secs = 3) {
      const e = ents[id];
      if (!e) return;
      e.group.visible = true;
      e.walk = { from: e.group.position.clone(), to: new THREE.Vector3(x, e.group.position.y, z), t: 0, secs };
    },
    /** True while the actor is visible and its head sits inside the central part of the frame. */
    framed(id, camera, { x = 0.6, y = 0.7 } = {}) {
      const e = ents[id];
      if (!e?.group.visible) return false;
      e.head.getWorldPosition(LOOK);
      LOOK.project(camera);
      return LOOK.z < 1 && Math.abs(LOOK.x) < x && Math.abs(LOOK.y) < y;
    },
    /** Mean screen position (NDC) of the heads of `ids`; null when none is visible in front of the camera. */
    centroid(ids, camera) {
      let sx = 0, sy = 0, n = 0;
      for (const id of ids) {
        const e = ents[id];
        if (!e?.group.visible) continue;
        e.head.getWorldPosition(LOOK); LOOK.project(camera);
        if (LOOK.z >= 1) continue;
        sx += LOOK.x; sy += LOOK.y; n++;
      }
      return n ? { x: sx / n, y: sy / n } : null;
    },
    /** Screen-space x (NDC) of an actor; 2 when it is behind the camera. Feeds the "where is the action" arrow. */
    screenX(id, camera) {
      const e = ents[id];
      if (!e) return 2;
      e.head.getWorldPosition(LOOK);
      LOOK.project(camera);
      return LOOK.z >= 1 ? 2 : LOOK.x;
    },
    anomalies: () => Object.entries(ents).filter(([, e]) => e.anomaly && e.group.visible).map(([id]) => id),
    hideAll() { for (const e of Object.values(ents)) { e.group.visible = false; e.walk = null; } },
    update(dt, t, camera) {
      for (const e of Object.values(ents)) {
        if (e.sprite && e.group.visible) {
          e.sprite.update(t, state.time, state.madness, !!e.walk);
          e.sprite.mesh.rotation.z = e.lie ? 1.5 : 0;
          if (camera) e.sprite.mesh.rotation.y = Math.atan2(camera.position.x - e.group.position.x, camera.position.z - e.group.position.z) - e.group.rotation.y;
        }
        if (!e.walk) continue;
        const w = e.walk;
        w.t = Math.min(1, w.t + dt / w.secs);
        e.group.position.lerpVectors(w.from, w.to, w.t);
        e.group.position.y = w.to.y + (w.t < 1 ? Math.abs(Math.sin(t * 6)) * 0.04 : 0); // walking bob on the stepped clock
        if (w.t >= 1) e.walk = null;
      }
    },
  };
}
