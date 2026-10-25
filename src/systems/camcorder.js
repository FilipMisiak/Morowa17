import { state, addMadness, kick } from '../core/state.js';
import { bus } from '../core/bus.js';
import { take } from './inventory.js';

const TAPE_SECONDS = 150;
const BATTERY_SECONDS = 110;

/**
 * The camcorder. Viewfinder up (hold RMB / Space, or the HUD button) = recording: tape and battery run, aim follows
 * the mouse much more, hands are busy (no hotspots). Looking at anomalies through the lens costs sanity; lowering the
 * camera recovers it.
 */
export function createCamcorder({ rig, actors, recording }) {
  const c = () => state.cam;

  function setRaised(on) {
    if (on && state.level !== 'running') return false;
    if (on && (c().tape <= 0 || c().battery <= 0)) { bus.emit('cam:empty'); return false; }
    if (on === c().raised) return on;
    c().raised = on;
    rig.aim = on ? 3.4 : 1;
    kick(0.35);
    bus.emit('cam:raised', on);
    return on;
  }

  bus.on('item:reload', (id) => {
    if (c().raised || !take(id)) return;
    if (id === 'kaseta') c().tape = 1; else c().battery = 1;
    bus.emit('toast', id === 'kaseta' ? 'NOWA KASETA' : 'NOWA BATERIA');
  });

  window.addEventListener('pointerdown', (e) => { if (e.button === 2) setRaised(true); });
  window.addEventListener('pointerup', (e) => { if (e.button === 2) setRaised(false); });
  window.addEventListener('contextmenu', (e) => e.preventDefault());
  window.addEventListener('keydown', (e) => {
    if (e.code !== 'Space' || e.repeat || state.flags.typing) return;
    e.preventDefault();
    setRaised(true);
  });
  window.addEventListener('keyup', (e) => { if (e.code === 'Space') setRaised(false); });
  const zoomBy = (d) => { c().zoom = Math.min(2.5, Math.max(1, c().zoom + d)); };
  window.addEventListener('wheel', (e) => zoomBy(-Math.sign(e.deltaY) * 0.15), { passive: true });

  return {
    setRaised,
    zoomBy,
    toggle: () => setRaised(!c().raised),
    update(dt) {
      if (state.level !== 'running') { if (c().raised) setRaised(false); return; }
      if (!c().raised) { addMadness(-0.006 * dt); recording.tick(dt); return; }
      c().tape -= dt / TAPE_SECONDS;
      c().battery -= dt / BATTERY_SECONDS;
      // only an anomaly in the picture costs sanity (ordinary scenery does not)
      let drain = 0;
      const seen = actors.anomalies().some((id) => actors.framed(id, rig.camera, { x: 0.8, y: 0.8 })) || recording.propAnomalyLive();
      if (seen) { drain = 0.015 * (0.8 + 0.6 * state.diff); kick(0.12); }
      state.flags.anomalyInFrame = seen;
      addMadness(drain * dt);
      recording.tick(dt);
      if (c().tape <= 0 || c().battery <= 0) {
        c().tape = Math.max(0, c().tape);
        c().battery = Math.max(0, c().battery);
        setRaised(false);
        bus.emit('cam:empty');
      }
    },
  };
}
