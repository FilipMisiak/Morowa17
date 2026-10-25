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
  const touch = matchMedia('(pointer: coarse)').matches;
  const field = document.getElementById('type-field'); // focusing it opens the on-screen keyboard

  bus.on('interact:desk', () => {
    if (typing || state.level !== 'running') return;
    if (state.cameraId !== 'desk') { bus.emit('toast', 'Do biurka: kamera 2'); return; }
    const text = state.flags.letter ?? DEFAULT_LETTER;
    let i = 0;
    typing = state.flags.typing = true;
    cabin.paper.typed('');
    state.flags.letterTyped = 0; state.flags.letterTyping = true;
    bus.emit('toast', `Przepisz: „${text}” — dobry znak uspokaja, zły dodaje obłędu. ${touch ? 'Schowaj klawiaturę, by przerwać.' : 'Esc przerywa.'}`);

    const done = (finished) => {
      window.removeEventListener('keydown', onKey);
      field.removeEventListener('input', onInput); field.removeEventListener('blur', onBlur); field.blur();
      typing = state.flags.typing = false; state.flags.letterTyping = false;
      if (finished) { addMadness(-0.1); state.flags.lettersDone = (state.flags.lettersDone ?? 0) + 1; bus.emit('letter:done'); }
    };
    const type = (key) => {
      if (plain(key) === plain(text[i])) {
        chatterTick(text[i], { base: 90, madness: state.madness });
        addMadness(-0.008);
        i++;
        state.flags.letterTyped = i;
        while (i < text.length && !/[\p{L}\p{N}]/u.test(text[i])) i++; // punctuation and spaces type themselves
        cabin.paper.typed(text.slice(0, i));
        if (i >= text.length) done(true);
      } else { kick(0.4); addMadness(0.04); bus.emit('toast', `Zły znak — następny: ${text[i] === ' ' ? 'spacja' : text[i]}`); }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') return done(false);
      if (touch || e.key.length !== 1) return;
      e.preventDefault();
      type(e.key);
    };
    const onInput = () => { for (const ch of field.value) if (typing) type(ch); field.value = ''; };
    const onBlur = () => done(false); // keyboard dismissed = letter abandoned
    window.addEventListener('keydown', onKey);
    if (touch) { field.addEventListener('input', onInput); field.addEventListener('blur', onBlur); field.focus(); }
  });
}
