import { state, addMadness, kick } from '../core/state.js';
import { bus } from '../core/bus.js';
import { sfx } from '../audio/drone.js';
import { roomSound } from '../audio/room.js';
import { take, ITEMS } from './inventory.js';

const rand = ([a, b]) => a + Math.random() * (b - a);

/**
 * Chores the Cameraman must do between takes (the "FNAF" half). Heard, not shown: a duty announces itself with a sound,
 * and only the matching camera shows the cause. Answer it with the right item before `window` seconds run out.
 *
 * Episode config (`duties` in the episode file): { hatch: { first: 20, every: [30, 45] }, dog: {...}, stove: { decay: 0.012 } }
 * Missing key = that duty never fires.
 */
export function createDuties({ cabin, actors, rig }) {
  let cfg = {};
  const timers = {};   // id -> seconds until it fires
  const live = {};     // id -> seconds left to answer
  const hide = [];     // delayed clean-ups of the "you failed" apparitions

  const DEFS = {
    hatch: {
      hotspot: 'hatch', cam: 'hatch', item: 'klodka', consume: false, window: 18, name: 'WŁAZ',
      todo: 'Coś stuka we włazie na strych',
      start() { sfx.creak(1.3); sfx.knock(2); roomSound('knock'); cabin.setHatch(0.3); },
      solve() { cabin.setHatch(0); sfx.knock(1); },
      fail() { cabin.setHatch(1); actors.place('shade', 0.1, -0.3, 0); later(() => { actors.show('shade', false); cabin.setHatch(0); }, 7); },
    },
    dog: {
      hotspot: 'window', cam: 'window', item: 'przysmak', consume: true, window: 16, name: 'PIES',
      todo: 'Pies skamle pod oknem — nakarm go',
      start() { sfx.bowl(9); },
      solve() { sfx.knock(1); },
      fail() { actors.place('dog', 1.9, 0.4, Math.PI / 2); later(() => actors.show('dog', false), 6); },
    },
  };

  const later = (fn, s) => hide.push({ fn, left: s });

  function strike(why) {
    state.strikes++;
    addMadness(0.12);
    kick(1);
    bus.emit('toast', `NIEDOPILNOWANE: ${why}  (${state.strikes}/3)`);
    if (state.strikes >= 3) bus.emit('level:lost', 'Za dużo zaniedbań. Dom wygrał.');
  }

  const toast = (t) => bus.emit('toast', t);
  const camLabel = (d) => rig.nodes()[d.cam]?.label ?? d.cam;
  const how = (d) => `kamera ${camLabel(d)} → ${ITEMS[d.item].label} → kliknij ${d.hotspot === 'hatch' ? 'właz' : 'okno'}`;

  for (const [id, d] of Object.entries(DEFS)) {
    bus.on('interact:' + d.hotspot, () => {
      if (state.cam.raised || !live[id]) return;
      if (state.cameraId !== d.cam) return;
      if (state.selected !== d.item) { toast(`Potrzebujesz: ${ITEMS[d.item].label}`); return; }
      if (d.consume && !take(d.item)) return;
      delete live[id];
      addMadness(-0.05);
      d.solve();
      timers[id] = rand(cfg[id].every);
    });
  }

  bus.on('interact:stove', () => {
    if (state.cam.raised || state.cameraId !== 'stove') return;
    if (state.selected !== 'wegiel') { toast(`Potrzebujesz: ${ITEMS.wegiel.label}`); return; }
    if (!take('wegiel')) return;
    state.fire = Math.min(1, state.fire + 0.45);
    sfx.bowl(3);
  });

  return {
    /** Replaces the schedule (called with the episode's `duties`, or from a `{ duty }` step). */
    configure(next = {}) {
      cfg = next;
      for (const id of Object.keys(DEFS)) if (cfg[id]) timers[id] ??= cfg[id].first ?? rand(cfg[id].every);
    },
    /** Chores that need an answer right now (for the task list): text, seconds left. */
    active() {
      const out = Object.entries(live).map(([id, left]) => ({ id, left, text: `${DEFS[id].name}: ${DEFS[id].todo} — ${how(DEFS[id])}` }));
      if (cfg.stove && state.fire < 0.4) out.push({ id: 'stove', left: null, text: `PIEC dogasa — kamera ${rig.nodes().stove?.label ?? 'PIEC'} → WĘGIEL → kliknij piec` });
      return out;
    },
    reset() { cfg = {}; for (const k of Object.keys(timers)) delete timers[k]; for (const k of Object.keys(live)) delete live[k]; hide.length = 0; },
    update(dt) {
      if (state.level !== 'running') return;
      for (let i = hide.length - 1; i >= 0; i--) if ((hide[i].left -= dt) <= 0) hide.splice(i, 1)[0].fn();

      for (const [id, d] of Object.entries(DEFS)) {
        if (!cfg[id]) continue;
        if (live[id] != null) {
          if ((live[id] -= dt) <= 0) { delete live[id]; d.fail(); strike(id === 'hatch' ? 'WŁAZ' : 'PIES'); timers[id] = rand(cfg[id].every); }
        } else if ((timers[id] -= dt) <= 0) { live[id] = d.window; d.start(); toast(`${d.todo}! ${how(d)}`); }
      }

      if (cfg.stove) {
        state.fire -= (cfg.stove.decay ?? 0.012) * dt;
        if (state.fire <= 0) { state.fire = 0.3; strike('PIEC'); }
      }
      cabin.setFire(state.fire);
    },
  };
}
