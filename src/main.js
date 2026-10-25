import './ui/style.css';
import * as THREE from 'three';
import { state, lerp, clamp, addMadness, kick } from './core/state.js';
import { bus } from './core/bus.js';
import { createPipeline } from './render/pipeline.js';
import { buildCabin } from './scenes/cabin.js';
import { createCameraRig } from './scenes/cameras.js';
import { createWorld } from './scenes/world.js';
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
import { createMenu, resumeId } from './ui/menu.js';
import { save } from './core/save.js';
import { loadEpisode, runEpisode, cancelRun } from './episodes/runner.js';

const params = new URLSearchParams(location.search);
const canvas = document.getElementById('screen');

const pipeline = createPipeline(canvas);
if (params.has('tier')) pipeline.setTier(Number(params.get('tier'))); // force a quality tier (0 best … 2 lowest)
const cabin = buildCabin();
const rig = createCameraRig();
const actors = buildActors(cabin.scene);
const world = createWorld({ rig, actors, initial: cabin });
const recording = createRecording(actors, rig);
const camcorder = createCamcorder({ rig, actors, recording });
const duties = createDuties({ cabin, actors });
const hud = createHud(rig, recording, camcorder);
initRituals({ cabin });
const input = createInput({
  canvas, pipeline,
  getCamera: () => rig.camera,
  getHotspots: () => world.current.hotspots,
  onHover: (h) => { hud.hint(h?.label); world.current.setHover?.(h?.id ?? null); },
});
const ctx = { scene: cabin.scene, cabin, world, rig, actors, recording, duties, THREE };

bus.on('location', () => hud.hint(''));
// cut effect on every camera change
bus.on('camera', () => kick(0.7));
rig.goTo('door');

let currentId = null;
async function play(id) {
  currentId = id;
  save.visit(id);
  result.hide();
  const ep = await loadEpisode(id);
  console.info('[episode]', ep.id, ep.status);
  await world.go(ep.location ?? 'chata', ep.startCamera ?? (ep.location ? undefined : 'door'));
  runEpisode(ep, ctx);
}
let nextId = null;
const result = createResult({ onRetry: () => play(currentId), onNext: () => nextId && play(nextId) });
const menu = createMenu(play);

// level verdicts: footage judged at the end of the steps, or the tape is lost mid-level (3 strikes / madness 1)
bus.on('level:end', (v) => {
  if (v.won) save.complete(currentId, state.coverage);
  nextId = v.next; result.show(v);
});
bus.on('level:lost', (reason) => {
  if (state.level !== 'running') return;
  state.level = 'lost'; cancelRun(); result.show({ won: false, reason, next: null });
});

// ---- main loop -------------------------------------------------------------------------------
let last = performance.now();
let started = false;
let fpsNow = 0;
let slowFor = 0; // seconds spent below the fps floor → drop one quality tier
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  fpsNow += (1 / Math.max(dt, 1e-3) - fpsNow) * 0.1;
  last = now;
  if (started && !document.hidden) {
    slowFor = fpsNow < 24 ? slowFor + dt : 0;
    if (slowFor > 4 && pipeline.setTier(pipeline.tier + 1)) { slowFor = 0; console.info('[perf] quality tier', pipeline.tier); }
  } else slowFor = 0;
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
  world.current.update(stepped, state.madness, state.cam.raised);
  rig.update(dt, input.pointer);
  hud.update();
  pipeline.render(world.current.scene, rig.camera, { time: stepped, madness: state.madness, glitch: state.glitch });
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// ---- start (user gesture: audio + speech need it) ---------------------------------------------
const begin = async (id) => {
  await audio.init();
  startDrone();
  document.getElementById('start').remove();
  hud.show();
  started = true;
  play(params.get('ep') || id);
};
document.getElementById('btn-start').addEventListener('click', () => begin('tasma1_ep01'));
const btnContinue = document.getElementById('btn-continue');
if (save.hasProgress()) {
  btnContinue.hidden = false;
  btnContinue.addEventListener('click', () => begin(resumeId()));
}

// H: controls legend (same markup as on the start screen)
const help = document.getElementById('help');
help.innerHTML = document.querySelector('#start .legend').outerHTML;
window.addEventListener('keydown', (e) => {
  if (state.flags.typing || document.getElementById('start')) return;
  if (e.key.toLowerCase() === 'h') help.hidden = !help.hidden;
  else if (e.key === 'Escape') help.hidden = true;
});
help.addEventListener('click', () => { help.hidden = true; });

// touch / on-screen tool buttons
const $ = (id) => document.getElementById(id);
$('t-zin').onclick = () => camcorder.zoomBy(0.25);
$('t-zout').onclick = () => camcorder.zoomBy(-0.25);
$('t-menu').onclick = () => menu.toggle();
$('t-help').onclick = () => { help.hidden = !help.hidden; };
$('t-full').onclick = () => { document.fullscreenElement ? document.exitFullscreen?.() : document.documentElement.requestFullscreen?.().catch(() => {}); };

// ---- dev keys ---------------------------------------------------------------------------------
window.addEventListener('keydown', (e) => {
  if (state.flags.typing) return;
  if (e.key === '[') addMadness(-0.1);
  if (e.key === ']') addMadness(0.1);
  if (e.key.toLowerCase() === 'g') kick(1);
});
if (params.has('debug')) {
  window.__m17 = { state, rig, cabin, world, actors, audio, play, clamp, bus };
  // stable read-only status for automated tests (scripts/test-runner.js) and MCP Puppeteer
  window.__GAME_DEBUG__ = {
    get status() {
      return {
        started,
        fps: Math.round(fpsNow),
        tier: pipeline.tier,
        currentCamera: state.cameraId,
        sanityLevel: state.madness,
        activeEpisode: state.episodeId,
        location: state.location,
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
