import './ui/style.css';
import * as THREE from 'three';
import { state, lerp, clamp, addMadness, kick } from './core/state.js';
import { bus } from './core/bus.js';
import { createPipeline } from './render/pipeline.js';
import { buildCabin } from './scenes/cabin.js';
import { createCameraRig } from './scenes/cameras.js';
import { createInput } from './core/input.js';
import { updateSanity } from './systems/sanity.js';
import { createDuties } from './systems/duties.js';
import { createRecording } from './systems/recording.js';
import { createCamcorder } from './systems/camcorder.js';
import { buildActors } from './scenes/actors.js';
import { createResult } from './ui/result.js';
import { initRituals } from './systems/rituals.js';
import { audio } from './audio/engine.js';
import { startDrone, updateDrone } from './audio/drone.js';
import { createHud } from './ui/hud.js';
import { createMenu } from './ui/menu.js';
import { loadEpisode, runEpisode, cancelRun } from './episodes/runner.js';

const params = new URLSearchParams(location.search);
const canvas = document.getElementById('screen');

const pipeline = createPipeline(canvas);
const cabin = buildCabin();
const rig = createCameraRig();
const actors = buildActors(cabin.scene);
const recording = createRecording(actors, rig);
const camcorder = createCamcorder({ rig, actors, recording });
const duties = createDuties({ cabin, actors });
const hud = createHud(rig, recording, camcorder);
initRituals({ cabin });
const input = createInput({
  canvas, pipeline,
  getCamera: () => rig.camera,
  getHotspots: () => cabin.hotspots,
  onHover: (h) => { hud.hint(h?.label); cabin.setHover(h?.id ?? null); },
});
const ctx = { scene: cabin.scene, cabin, rig, actors, recording, duties, THREE };

// cut effect on every camera change
bus.on('camera', () => kick(0.7));
rig.goTo('door');

let currentId = null;
async function play(id) {
  currentId = id;
  result.hide();
  const ep = await loadEpisode(id);
  console.info('[episode]', ep.id, ep.status);
  rig.goTo(ep.startCamera ?? 'door');
  runEpisode(ep, ctx);
}
let nextId = null;
const result = createResult({ onRetry: () => play(currentId), onNext: () => nextId && play(nextId) });
const menu = createMenu(play);

// level verdicts: footage judged at the end of the steps, or the tape is lost mid-level (3 strikes / madness 1)
bus.on('level:end', (v) => { nextId = v.next; result.show(v); });
bus.on('level:lost', (reason) => {
  if (state.level !== 'running') return;
  state.level = 'lost'; cancelRun(); result.show({ won: false, reason, next: null });
});

// ---- main loop -------------------------------------------------------------------------------
let last = performance.now();
let started = false;
let fpsNow = 0;
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  fpsNow += (1 / Math.max(dt, 1e-3) - fpsNow) * 0.1;
  last = now;
  state.time += dt;
  if (started) state.tapeSeconds += dt;
  state.glitch = Math.max(0, state.glitch - dt * 2.5);

  // choppy clock: frame rate sags from 12 to 6 fps as madness rises ("niejednorodny klatraż")
  const fps = lerp(12, 6, state.madness);
  const stepped = Math.floor(state.time * fps) / fps;

  if (started) {
    updateSanity(dt, rig.node); camcorder.update(dt); duties.update(dt); updateDrone();
    if (state.level === 'running' && state.madness >= 1) bus.emit('level:lost', 'Powidok stanął tuż obok. Obłęd 100%.');
  }
  actors.update(dt, stepped, rig.camera);
  cabin.update(stepped, state.madness, state.cam.raised);
  rig.update(dt, input.pointer);
  hud.update();
  pipeline.render(cabin.scene, rig.camera, { time: stepped, madness: state.madness, glitch: state.glitch });
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// ---- start (user gesture: audio + speech need it) ---------------------------------------------
document.getElementById('btn-start').addEventListener('click', async () => {
  await audio.init();
  startDrone();
  document.getElementById('start').remove();
  hud.show();
  started = true;
  play(params.get('ep') || 'tasma0_prolog');
});

// ---- dev keys ---------------------------------------------------------------------------------
window.addEventListener('keydown', (e) => {
  if (state.flags.typing) return;
  if (e.key === '[') addMadness(-0.1);
  if (e.key === ']') addMadness(0.1);
  if (e.key.toLowerCase() === 'g') kick(1);
});
if (params.has('debug')) {
  window.__m17 = { state, rig, cabin, actors, audio, play, clamp, bus };
  // stable read-only status for automated tests (scripts/test-runner.js) and MCP Puppeteer
  window.__GAME_DEBUG__ = {
    get status() {
      return {
        started,
        fps: Math.round(fpsNow),
        currentCamera: state.cameraId,
        sanityLevel: state.madness,
        activeEpisode: state.episodeId,
        level: state.level,
        coverage: state.coverage,
        strikes: state.strikes,
        isRecording: state.cam.raised,
        drawCalls: pipeline.renderer?.info?.render?.calls ?? null,
      };
    },
    forceTriggerEvent: (name, payload) => bus.emit(name, payload),
  };
}
