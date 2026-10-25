// Global, mutable game state. Keep it small and plain. Systems read/write it, nothing else.
export const state = {
  madness: 0,        // 0..1  (1 = full madness). Drives shader, audio, light, frame rate.
  glitch: 0,         // 0..1  impulse, decays on its own. Set to 1 on cuts / scares.
  time: 0,           // seconds since start
  episodeId: null,
  cameraId: null,
  flags: {},         // free-form episode/event flags, e.g. flags.atticNoise
  tapeSeconds: 0,    // in-game VHS counter
  cam: { raised: false, tape: 1, battery: 1, zoom: 1 }, // camcorder: viewfinder up = recording
  coverage: 0,       // 0..1 share of the level's required footage that was captured
  strikes: 0,        // missed duties; 3 = tape lost
  fire: 0.7,         // stove fire 0..1
  inventory: {},     // itemId -> count
  selected: null,    // inventory item picked for use on a hotspot
  level: 'idle',     // 'idle' | 'running' | 'won' | 'lost'
  location: 'chata', // current location id (scenes/world.js)
};

/** Fresh level: keeps global time, resets everything the player manages. */
export function resetLevel() {
  Object.assign(state, {
    madness: 0, glitch: 0, flags: {}, coverage: 0, strikes: 0, fire: 0.7, selected: null, level: 'running',
    cam: { raised: false, tape: 1, battery: 1, zoom: 1 }, inventory: {},
  });
}

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const addMadness = (d) => { state.madness = clamp(state.madness + d, 0, 1); };
export const kick = (amount = 1) => { state.glitch = Math.max(state.glitch, amount); };
