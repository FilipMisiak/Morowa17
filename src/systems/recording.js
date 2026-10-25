import { state } from '../core/state.js';

/**
 * Footage accounting. An episode declares "beats" (a scene worth filming); each needs `need` seconds of the right
 * actors held in frame while the viewfinder is up. Coverage = captured seconds / required seconds over the whole level.
 */
export function createRecording(actors, rig) {
  const beats = new Map();
  let total = 0;

  const refresh = () => {
    let got = 0;
    for (const b of beats.values()) got += b.got;
    state.coverage = total ? Math.min(1, got / total) : 1;
  };

  return {
    /** Sum the required footage up front from the episode's steps, so the % is stable. */
    reset(steps = []) {
      beats.clear();
      total = steps.reduce((s, st) => s + (st.beat?.need ?? 0), 0);
      state.coverage = total ? 0 : 1;
    },
    start({ id, actors: who, need }) { beats.set(id, { id, who, need, got: 0, active: true }); },
    end(id) { const b = beats.get(id); if (b) b.active = false; },
    tick(dt) {
      for (const b of beats.values()) {
        if (!b.active || b.got >= b.need) continue;
        if (state.cam.raised && b.who.every((a) => actors.framed(a, rig.camera))) b.got = Math.min(b.need, b.got + dt);
      }
      refresh();
    },
    /** What the viewfinder should tell the player: nothing, "in frame", or which way to turn. */
    hint() {
      const live = [...beats.values()].find((b) => b.active && b.got < b.need);
      if (!live) return null;
      const miss = live.who.find((a) => !actors.framed(a, rig.camera));
      if (!miss) return { who: live.who, ok: true };
      const x = actors.screenX(miss, rig.camera);
      return { who: live.who, ok: false, dir: x > 0.45 && x <= 1.5 ? '►' : x < -0.45 && x >= -1.5 ? '◄' : '◄ ►' };
    },
  };
}
