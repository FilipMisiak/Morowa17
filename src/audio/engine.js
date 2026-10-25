/**
 * Web Audio core. Everything you hear is synthesised here, no audio files.
 *
 *   ambient ┐
 *   voice   ├─> master ─> tape (lowpass + wow/flutter) ─> compressor ─> out
 *   sfx     ┘                  + constant tape hiss
 */
let ctx = null;
let master = null;
let noiseBuf = null;
const buses = {};

export const audio = {
  get ctx() { return ctx; },
  get ready() { return !!ctx; },

  /** Must be called from a user gesture (the "WŁÓŻ KASETĘ" click). */
  async init() {
    if (ctx) { await ctx.resume(); return; }
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0.9;

    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 7000;
    const flutter = ctx.createDelay(0.05); flutter.delayTime.value = 0.01;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.6;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.0008;
    lfo.connect(lfoGain); lfoGain.connect(flutter.delayTime); lfo.start();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 6;

    master.connect(lp); lp.connect(flutter); flutter.connect(comp); comp.connect(ctx.destination);

    for (const name of ['ambient', 'voice', 'sfx']) {
      buses[name] = ctx.createGain();
      buses[name].gain.value = name === 'ambient' ? 0.8 : 1;
      buses[name].connect(master);
    }

    // constant tape hiss
    const hiss = ctx.createBufferSource(); hiss.buffer = audio.noise(); hiss.loop = true;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 3500;
    const hg = ctx.createGain(); hg.gain.value = 0.012;
    hiss.connect(hp); hp.connect(hg); hg.connect(master); hiss.start();

    await ctx.resume();
  },

  bus(name) { return buses[name]; },

  /** 2 s of white noise, cached. Use with random start offsets for cheap variation. */
  noise() {
    if (noiseBuf) return noiseBuf;
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return noiseBuf;
  },

  /** A short burst of filtered noise. Returns the gain node. */
  noiseBurst({ dest, when = ctx.currentTime, dur = 0.1, type = 'bandpass', freq = 800, q = 1, gain = 0.3 }) {
    const src = ctx.createBufferSource(); src.buffer = audio.noise();
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(gain, when + Math.min(0.01, dur / 3));
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    src.connect(f); f.connect(g); g.connect(dest ?? buses.sfx);
    src.start(when, Math.random() * 1.5); src.stop(when + dur + 0.02);
    return g;
  },
};
