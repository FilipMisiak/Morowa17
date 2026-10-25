import { audio } from './engine.js';
import { makeDemonChain } from './fx.js';
import { mumble } from './formant.js';
import { state } from '../core/state.js';

/**
 * VOICE DESIGN (read docs/AUDIO_DESIGN.md)
 *
 * IMPORTANT browser limit: window.speechSynthesis plays straight to the OS audio output. It cannot be routed into
 * the Web Audio graph, so filters/distortion CANNOT be applied to it. Therefore every line is built from layers
 * that are deliberately stacked on top of each other:
 *
 *  A  formant mumble through the DEMON chain  (fully processed, always available, carries the "tape" sound)
 *  A2 octave-down double of A, late by ~0.2 s  (the thing speaking underneath)
 *  B  speechSynthesis "ghost": pl-PL voice, minimum rate, minimum pitch  (raw but slowed; masked by A + noise bursts)
 *  D  whisper echo: pitched up, quiet, 0.5–1 s late (an after-image of the line)
 *  C  per-character chatter  (see chatter.js, driven by the subtitle typewriter)
 *
 * If no Polish speechSynthesis voice exists (e.g. some Linux), layer B is skipped and the game still works.
 */
export const SPEAKERS = {
  gospodarz:    { f0: 92,  rate: 0.12, pitch: 0.0, chatter: 70,  echo: 0.19, color: '#d8c9a3' },
  wspollokator: { f0: 150, rate: 0.30, pitch: 0.3, chatter: 115, echo: 0.11, color: '#d8c9a3' },
  strych:       { f0: 41,  rate: 0.10, pitch: 0.0, chatter: 45,  echo: 0.34, color: '#9fb07a' },
  tasma:        { f0: 120, rate: 0.55, pitch: 0.1, chatter: 90,  echo: 0.08, color: '#d8c9a3' }, // narrator / on-screen tape text
};
// Series characters (the Cameraman is silent): Konon and Major reuse the first two voice profiles.
// label/tag = who is shown next to the subtitle so the player always knows who speaks
SPEAKERS.konon = { ...SPEAKERS.gospodarz, label: 'KONON', tag: '#e6c277' };
SPEAKERS.major = { ...SPEAKERS.wspollokator, label: 'MAJOR', tag: '#8fc3b0' };
SPEAKERS.gosc = { ...SPEAKERS.wspollokator, f0: 118, label: 'PAN', tag: '#d8c060' };
SPEAKERS.zolty = { ...SPEAKERS.wspollokator, f0: 135, label: 'ŻÓŁTA KURTKA', tag: '#d8c820' };
SPEAKERS.meczennik = { ...SPEAKERS.gospodarz, f0: 80, label: 'MĘCZENNIK', tag: '#a8c898' };
SPEAKERS.maska = { ...SPEAKERS.gospodarz, f0: 70, label: 'MASKA', tag: '#b89868' };
SPEAKERS.brazowy = { ...SPEAKERS.gospodarz, f0: 100, label: 'BRĄZOWA KURTKA', tag: '#a8a050' };
// tape 2 minor characters: label shown next to the subtitle
for (const [id, label, tag, f0] of [
  ['czapka', 'CZAPKA', '#6ac8c0', 110], ['kapelusz', 'KAPELUSZ', '#8ab870', 95], ['bluza', 'ŻÓŁTA BLUZA', '#c8d040', 88],
  ['szarak', 'SZARA KURTKA', '#a8b098', 100], ['chudy', 'CHUDY', '#c8d0c0', 75], ['zoltooki', 'ŻÓŁTE OCZY', '#e0d040', 70],
  ['czerwonooki', 'CZERWONE OCZY', '#d86050', 62], ['szorty', 'SZORTY', '#a8c8a0', 96], ['rudy', 'RUDY SWETER', '#c88a50', 104], ['okularnik', 'OKULARY', '#a0b898', 90],
]) SPEAKERS[id] = { ...SPEAKERS.gospodarz, f0, label, tag };
SPEAKERS.strych.label = 'STRYCH'; SPEAKERS.strych.tag = '#9fb07a';

const chains = new Map();
function chainFor(name) {
  if (chains.has(name)) return chains.get(name);
  const sp = SPEAKERS[name] ?? SPEAKERS.tasma;
  const chain = makeDemonChain(audio.ctx, { echo: sp.echo, lp: name === 'strych' ? 900 : 1900, drive: name === 'strych' ? 60 : 28 });
  chain.output.connect(audio.bus('voice'));
  chains.set(name, chain);
  return chain;
}

let plVoice = null;
function findVoice() {
  if (!('speechSynthesis' in window)) return null;
  const vs = speechSynthesis.getVoices();
  plVoice = vs.find((v) => v.lang?.toLowerCase().startsWith('pl')) ?? null;
  return plVoice;
}
if ('speechSynthesis' in window) {
  findVoice();
  speechSynthesis.addEventListener?.('voiceschanged', findVoice);
}

let pending = 0;
function ghost(text, sp) {
  if (!plVoice && !findVoice()) return;
  if (pending > 2) { speechSynthesis.cancel(); pending = 0; } // keep the queue short, never lag behind the picture
  const u = new SpeechSynthesisUtterance(text);
  u.voice = plVoice; u.lang = plVoice.lang;
  u.rate = Math.max(0.1, sp.rate);
  u.pitch = Math.max(0, sp.pitch);
  u.volume = 0.55;
  pending++;
  u.onend = u.onerror = () => { pending = Math.max(0, pending - 1); };
  speechSynthesis.speak(u);
}

/**
 * Speak a line (audio only). Returns total scripted duration in seconds.
 * charInterval must match the subtitle typewriter so syllables land on the letters.
 */
export function speak(text, { speaker = 'gospodarz', charInterval = 0.055 } = {}) {
  if (!audio.ready) return text.length * charInterval;
  const sp = SPEAKERS[speaker] ?? SPEAKERS.tasma;
  const chain = chainFor(speaker);
  chain.setMadness(state.madness);
  const t0 = audio.ctx.currentTime + 0.03;

  const dur = mumble(chain.input, text, { f0: sp.f0, charInterval, gain: 0.5, start: t0 });                    // A
  mumble(chain.input, text, { f0: sp.f0 / 2, charInterval, gain: 0.35, start: t0 + 0.2, glide: -0.2 });          // A2
  if (state.madness > 0.25 || Math.random() < 0.4) {                                                              // D
    mumble(chain.input, text, { f0: sp.f0 * 1.6, charInterval: charInterval * 1.15, gain: 0.12, start: t0 + 0.5 + Math.random() * 0.5 });
  }
  setTimeout(() => ghost(text, sp), 80 + Math.random() * 250);                                                    // B (late on purpose)
  // mask the raw TTS with noise bursts so it never sounds "clean"
  for (let i = 0; i < Math.ceil(dur / 0.7); i++) {
    audio.noiseBurst({ when: t0 + i * 0.7 + Math.random() * 0.3, dur: 0.12, type: 'bandpass', freq: 1500 + Math.random() * 2000, q: 0.7, gain: 0.08 + state.madness * 0.1 });
  }
  return dur;
}

export function stopSpeaking() { if ('speechSynthesis' in window) { speechSynthesis.cancel(); pending = 0; } }
