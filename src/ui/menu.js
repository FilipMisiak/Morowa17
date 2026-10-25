import { state } from '../core/state.js';
import { EPISODE_LIST } from '../episodes/runner.js';

/** Episode picker (M). Dev convenience; later can become the "tape shelf". */
export function createMenu(onPick) {
  const el = document.getElementById('menu');
  const build = () => {
    el.innerHTML = '<h2>KASETY</h2>';
    for (const e of EPISODE_LIST) {
      const b = document.createElement('button');
      const label = e.tape === 0 ? 'PROLOG' : `TAŚMA ${e.tape} · ODC. ${String(e.index).padStart(2, '0')}`;
      b.textContent = `${label}  ${e.title ?? ''}`;
      b.onclick = () => { el.hidden = true; onPick(e.id); };
      el.appendChild(b);
    }
  };
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'm' && !state.flags.typing && !document.getElementById('start')) {
      el.hidden = !el.hidden;
      if (!el.hidden) build();
    }
  });
  return { open() { build(); el.hidden = false; } };
}
