import { state } from '../core/state.js';

/** Share of a beat's `need` the player must actually capture (the original scenes are short; framing takes a moment). */
export const NEED_SCALE = 0.6;

const prettify = (id) => id.replace(/[_-]+/g, ' ').replace(/^./, (c) => c.toUpperCase());

/** All beats of a step list, including those nested in `overlap`. */
const collectBeats = (steps, out = []) => {
  for (const st of steps) {
    if (st.beat) out.push(st.beat);
    if (st.overlap) collectBeats(st.overlap, out);
  }
  return out;
};

/**
 * Footage accounting. An episode declares "beats" (a scene worth filming); each needs `need` seconds (x NEED_SCALE) of the
 * right actors held in frame while the viewfinder is up. Coverage = captured seconds / required seconds over the level.
 * Every beat is registered up front so the task list can show the whole level (done / now / later).
 */
export function createRecording(actors, rig) {
  const beats = new Map();
  let total = 0;

  const refresh = () => {
    let got = 0;
    for (const b of beats.values()) got += b.got;
    state.coverage = total ? Math.min(1, got / total) : 1;
  };

  const liveBeat = () => [...beats.values()].find((b) => b.active && b.got < b.need);

  return {
    /** Sum the required footage up front from the episode's steps, so the % is stable. */
    reset(steps = []) {
      beats.clear();
      for (const b of collectBeats(steps)) {
        const need = b.need * NEED_SCALE;
        beats.set(b.id, { id: b.id, label: b.label ?? prettify(b.id), who: b.actors, need, got: 0, active: false });
      }
      total = [...beats.values()].reduce((s, b) => s + b.need, 0);
      state.coverage = total ? 0 : 1;
    },
    start({ id }) { const b = beats.get(id); if (b) b.active = true; },
    end(id) { const b = beats.get(id); if (b) { b.active = false; b.ended = true; } },
    tick(dt) {
      for (const b of beats.values()) {
        if (!b.active || b.got >= b.need) continue;
        if (state.cam.raised && b.who.every((a) => actors.framed(a, rig.camera))) b.got = Math.min(b.need, b.got + dt);
      }
      refresh();
    },
    /** For the task list: every beat with its progress and phase ('done' | 'live' | 'todo' | 'missed'). */
    list() {
      return [...beats.values()].map((b) => ({
        id: b.id, label: b.label, need: b.need, got: b.got,
        phase: b.got >= b.need ? 'done' : b.active ? 'live' : b.got > 0 || b.ended ? 'missed' : 'todo',
      }));
    },
    /** Screen-space offset (NDC) of the live scene's centre; the rig nudges the aim towards it while filming. */
    aimTarget() {
      const b = liveBeat();
      if (!b) return null;
      return actors.centroid(b.who, rig.camera);
    },
    /** What the viewfinder should tell the player: nothing, "in frame", or which way to turn. */
    hint() {
      const live = liveBeat();
      if (!live) return null;
      const progress = { label: live.label, got: live.got, need: live.need };
      const miss = live.who.find((a) => !actors.framed(a, rig.camera));
      if (!miss) return { who: live.who, ok: true, ...progress };
      const x = actors.screenX(miss, rig.camera);
      return { who: live.who, ok: false, ...progress, dir: x > 0.45 && x <= 1.5 ? '►' : x < -0.45 && x >= -1.5 ? '◄' : '◄ ►' };
    },
  };
}
