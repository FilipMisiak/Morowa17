import { state, addMadness, kick, resetLevel } from '../core/state.js';
import { give } from '../systems/inventory.js';
import { bus } from '../core/bus.js';
import { playLine } from '../ui/subtitles.js';
import { speak } from '../audio/voice.js';
import { sfx } from '../audio/drone.js';

const modules = import.meta.glob('./tasma*.js'); // lazy: one chunk per episode

/** The canonical list of 20 episodes (tape 1: 1-10, tape 2: 11-20). */
export const EPISODE_LIST = [
  ...Array.from({ length: 20 }, (_, i) => {
    const tape = i < 10 ? 1 : 2, index = (i % 10) + 1;
    return { id: `tasma${tape}_ep${String(index).padStart(2, '0')}`, tape, index, youtubeIndex: i + 1, title: '' };
  }),
];

export async function loadEpisode(id) {
  const meta = EPISODE_LIST.find((e) => e.id === id);
  const loader = modules[`./${id}.js`];
  if (!loader) return { ...meta, status: 'missing', steps: [{ caption: { text: `[${id}] — odcinek jeszcze nie zaimplementowany`, pos: 'center' } }, { wait: 2500 }] };
  return { ...meta, ...(await loader()).default };
}

let runToken = 0;

/** Stops the current run (tape lost, retry, new episode). */
export const cancelRun = () => { runToken++; };

/** Share of the required footage the player must capture to pass the level. */
const PASS_COVERAGE = 0.995;

/** Next episode in the playlist, or null after the last one. */
export const nextEpisodeId = (id) => {
  const i = EPISODE_LIST.findIndex((e) => e.id === id);
  return EPISODE_LIST[i + 1]?.id ?? null;
};

/**
 * Runs one level: resets the player's resources, applies the episode's `duties` / `items` / `letter`, then plays the
 * steps (the scene happens whether or not you film it) and finally judges the footage.
 * Starting a new episode cancels the previous run.
 */
export async function runEpisode(ep, ctx) {
  const token = ++runToken;
  resetLevel();
  state.episodeId = ep.id;
  state.flags.letter = ep.letter;
  state.tapeSeconds = 0;
  document.getElementById('hud-ep').textContent = `${ep.tape} · ${String(ep.index).padStart(2, '0')}`;
  ctx.rig.aim = 1;
  ctx.actors.hideAll();
  ctx.cabin.setHatch(0);
  ctx.duties.reset();
  ctx.duties.configure(ep.duties);
  ctx.recording.reset(ep.steps);
  for (const [item, n] of Object.entries(ep.items ?? { kaseta: 1, bateria: 1, wegiel: 2, klodka: 1, przysmak: 2 })) give(item, n);
  ctx.clock = { t0: performance.now(), scale: ep.timeScale ?? 1 };
  await ep.setup?.(ctx);
  for (const step of ep.steps ?? []) {
    if (token !== runToken) return; // cancelled
    await runStep(step, ctx);
  }
  if (token !== runToken) return;
  await ep.teardown?.(ctx);
  const won = state.coverage >= PASS_COVERAGE;
  state.level = won ? 'won' : 'lost';
  bus.emit('level:end', { won, reason: won ? '' : 'Za mało materiału — nie nagrałeś wszystkich scen.', next: nextEpisodeId(ep.id) });
}

// ?speed=N shortens scripted waits N times (automated tests only)
const SPEED = Math.max(1, Number(new URLSearchParams(location.search).get('speed')) || 1);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms / SPEED));

/** Covers the picture with black (or, with `burn`, the cream of a burnt tape) for `ms`, like the empty frames of the original. */
async function blackout(ms, burn) {
  const el = document.getElementById('blackout');
  el.classList.toggle('burn', !!burn); el.classList.add('on');
  await sleep(ms);
  el.classList.remove('on');
}

async function runStep(s, ctx) {
  // { at: seconds } waits until that moment of the original episode (timestamps of the original episode)
  if (s.at != null && ctx.clock) {
    const ms = (s.at * 1000 * ctx.clock.scale) / SPEED - (performance.now() - ctx.clock.t0);
    if (ms > 0) await new Promise((r) => setTimeout(r, ms));
  }
  if (s.location) { await ctx.world.go(s.location, s.camera); sfx.cut(); }
  else if (s.camera) { ctx.rig.goTo(s.camera); kick(0.8); sfx.cut(); }
  if (s.line) await playLine({ kind: 'speech', ...s.line });
  if (s.caption) await playLine({ kind: 'caption', ...s.caption });
  if (s.black) await blackout(s.black, s.burn);
  if (s.say) speak(s.say.text, s.say);
  if (s.overlap) await Promise.all(s.overlap.map((x) => runStep(x, ctx)));
  if (s.place) ctx.actors.place(s.place.id, s.place.x, s.place.z, s.place.face, s.place.y);
  if (s.walk) ctx.actors.walk(s.walk.id, s.walk.x, s.walk.z, s.walk.secs);
  if (s.lie) ctx.actors.lie(s.lie.id, s.lie.on ?? true);
  if (s.show) ctx.actors.show(s.show.id, s.show.on ?? true);
  if (s.beat) ctx.recording.start(s.beat);
  if (s.beatEnd) ctx.recording.end(s.beatEnd);
  if (s.give) give(s.give.item ?? s.give, s.give.n ?? 1);
  if (s.duty) ctx.duties.configure(s.duty);
  if (s.sfx) sfx[s.sfx]?.();
  if (s.glitch != null) kick(s.glitch);
  if (s.tint != null) state.tint = s.tint;
  if (s.madness) addMadness(s.madness);
  if (s.set) Object.assign(state.flags, s.set);
  if (s.waitFor) await bus.once(s.waitFor);
  if (s.run) await s.run(ctx);
  if (s.wait) await sleep(s.wait);
}
