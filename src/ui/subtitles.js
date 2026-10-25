import { state } from '../core/state.js';
import { chatterTick } from '../audio/chatter.js';
import { speak, SPEAKERS } from '../audio/voice.js';

const root = () => document.getElementById('subs');

const POS = {
  bottom: { left: '50%', bottom: '9%', transform: 'translateX(-50%)', textAlign: 'center' },
  top:    { left: '50%', top: '12%', transform: 'translateX(-50%)', textAlign: 'center' },
  center: { left: '50%', top: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' },
  left:   { left: '6%', top: '50%', transform: 'translateY(-50%)' },
  right:  { right: '6%', top: '50%', transform: 'translateY(-50%)', textAlign: 'right' },
};

/**
 * Plays ONE line: typewriter subtitle + per-character chatter + layered voice, all at once and overlapping.
 *
 * entry = {
 *   text,                    // copied VERBATIM from the original, including deliberate misspellings
 *   speaker?: 'gospodarz' | 'wspollokator' | 'strych' | 'tasma',
 *   kind?: 'speech' | 'caption',   // caption = on-screen tape text (no voice, only chatter)
 *   color?: '#rrggbb',       // colour of the on-screen text in the original (usually beige)
 *   pos?: 'bottom' | 'top' | 'center' | 'left' | 'right' | { x: 0..100, y: 0..100 },  // % of the screen
 *   charInterval?: ms per char (default 55),
 *   hold?: ms to keep text after typing (default 2200),
 *   voice?: false            // silence the voice layers
 * }
 * Resolves when the subtitle has finished typing (NOT when it disappears), so the next line can overlap it.
 */
export function playLine(entry) {
  const { text, speaker = 'tasma', kind = 'speech', pos = 'bottom', hold = 2200 } = entry;
  const sp = SPEAKERS[speaker] ?? SPEAKERS.tasma;
  const ms = entry.charInterval ?? 55;
  const el = document.createElement('div');
  el.className = 'sub ' + (kind === 'caption' ? 'caption' : '');
  el.style.color = entry.color ?? sp.color;
  if (typeof pos === 'object') Object.assign(el.style, { left: pos.x + '%', top: pos.y + '%', transform: 'translate(-50%,-50%)', textAlign: 'center' });
  else Object.assign(el.style, POS[pos] ?? POS.bottom);
  const who = document.createElement('span');
  const body = document.createElement('span');
  if (kind !== 'caption' && sp.label) {
    who.className = 'who';
    who.textContent = sp.label;
    who.style.color = sp.tag;
    el.append(who, body);
  } else el.append(body);
  root().appendChild(el);

  if (kind !== 'caption' && entry.voice !== false) speak(text, { speaker, charInterval: ms / 1000 });

  return new Promise((resolve) => {
    const start = performance.now();
    let shown = 0;
    const tick = () => {
      const target = Math.min(text.length, Math.floor((performance.now() - start) / ms) + 1);
      while (shown < target) { chatterTick(text[shown], { base: sp.chatter, madness: state.madness }); shown++; }
      body.textContent = text.slice(0, shown);
      el.classList.toggle('shake', state.madness > 0.55);
      if (shown < text.length) requestAnimationFrame(tick);
      else { resolve(); setTimeout(() => el.remove(), hold); }
    };
    tick();
  });
}
