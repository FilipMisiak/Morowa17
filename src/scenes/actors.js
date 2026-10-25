import * as THREE from 'three';
import { psxify } from '../render/psx.js';

const LOOK = new THREE.Vector3();

/**
 * Konon, Major and the anomalies, built from primitives (placeholder puppets; being replaced by drawn 2D character sprites, see docs/PLAN.md §6).
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

  const person = (id, { coat, skin = 0x8a7a5a, h = 1.75, cap = false }) => {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, h * 0.5, 0.3), lambert(coat));
    body.position.y = h * 0.55;
    const legs = new THREE.Mesh(new THREE.BoxGeometry(0.36, h * 0.3, 0.24), lambert(0x1a1612));
    legs.position.y = h * 0.15;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 7, 6), lambert(skin));
    head.position.y = h * 0.86;
    g.add(body, legs, head);
    if (cap) {
      const c = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.08, 0.34), lambert(0x2a2c1c));
      c.position.y = h * 0.86 + 0.14;
      g.add(c);
    }
    register(id, g, false, head);
  };

  person('konon', { coat: 0x4a4a2a, h: 1.82 });
  person('major', { coat: 0x24261a, h: 1.68, cap: true });

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
    place(id, x, z, face = 0, y = 0) {
      const e = ents[id];
      if (!e) return;
      e.group.position.set(x, y, z);
      e.group.rotation.y = face;
      e.group.visible = true;
      e.walk = null;
    },
    show(id, on = true) { if (ents[id]) ents[id].group.visible = on; },
    walk(id, x, z, secs = 3) {
      const e = ents[id];
      if (!e) return;
      e.group.visible = true;
      e.walk = { from: e.group.position.clone(), to: new THREE.Vector3(x, e.group.position.y, z), t: 0, secs };
    },
    /** True while the actor is visible and its head sits inside the central part of the frame. */
    framed(id, camera, { x = 0.45, y = 0.55 } = {}) {
      const e = ents[id];
      if (!e?.group.visible) return false;
      e.head.getWorldPosition(LOOK);
      LOOK.project(camera);
      return LOOK.z < 1 && Math.abs(LOOK.x) < x && Math.abs(LOOK.y) < y;
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
    update(dt, t) {
      for (const e of Object.values(ents)) {
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
