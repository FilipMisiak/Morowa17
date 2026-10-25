import { bus } from '../core/bus.js';
import { state, addMadness, kick } from '../core/state.js';
import { chatterTick } from '../audio/chatter.js';

const DEFAULT_LETTER = 'TEST: Szanowny Panstwo, zglaszam wlaz.'; // placeholder; episodes set `letter` from the lore
const plain = (c) => c.toLowerCase().replace('ł', 'l').normalize('NFD').replace(/\p{M}/gu, '');

/**
 * The typewriter ritual: at the desk camera, click the desk and type the episode's letter key by key (diacritics are
 * matched by their base letter). Finishing a letter calms the madness; Esc abandons it. Chores (hatch, dog, stove)
 * live in duties.js.
 */
export function initRituals({ cabin }) {
  let typing = false;

  bus.on('interact:desk', () => {
    if (typing || state.level !== 'running') return;
    if (state.cameraId !== 'desk') { bus.emit('toast', 'Do biurka: kamera 2'); return; }
    const text = state.flags.letter ?? DEFAULT_LETTER;
    let i = 0;
    typing = state.flags.typing = true;
    cabin.paper.typed('');
    bus.emit('toast', 'PISZ — Esc przerywa');

    const done = (finished) => {
      window.removeEventListener('keydown', onKey);
      typing = state.flags.typing = false;
      if (finished) { addMadness(-0.15); state.flags.lettersDone = (state.flags.lettersDone ?? 0) + 1; bus.emit('letter:done'); }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') return done(false);
      if (e.key.length !== 1) return;
      e.preventDefault();
      if (plain(e.key) === plain(text[i])) {
        chatterTick(text[i], { base: 90, madness: state.madness });
        i++;
        while (i < text.length && !/[\p{L}\p{N}]/u.test(text[i])) i++; // punctuation and spaces type themselves
        cabin.paper.typed(text.slice(0, i));
        if (i >= text.length) done(true);
      } else { kick(0.25); addMadness(0.01); }
    };
    window.addEventListener('keydown', onKey);
  });
}
