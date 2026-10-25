import { state } from '../core/state.js';
import { EPISODE_LIST } from '../episodes/runner.js';
import { save } from '../core/save.js';

const UNLOCK_ALL = new URLSearchParams(location.search).has('debug');

/** Episode n is playable once the previous one was saved (the prologue and the first episode are always open). */
export function isUnlocked(id) {
  const i = EPISODE_LIST.findIndex((e) => e.id === id);
  return UNLOCK_ALL || i <= 1 || save.isDone(EPISODE_LIST[i - 1].id);
}

/** First episode that was not saved yet (where "continue" resumes). */
export function resumeId() {
  const e = EPISODE_LIST.slice(1).find((x) => !save.isDone(x.id));
  return e?.id ?? EPISODE_LIST[EPISODE_LIST.length - 1].id;
}

/** Tape shelf (M): two cassettes with their ten days each; locked days stay dim until the previous tape is saved. */
export function createMenu(onPick) {
  const el = document.getElementById('menu');
  const close = () => { el.hidden = true; };
  const build = () => {
    el.replaceChildren();
    const h = document.createElement('h2'); h.textContent = 'KASETY'; el.appendChild(h);
    const groups = [[0, 'TAŚMA ZEROWA'], [1, 'TAŚMA 1'], [2, 'TAŚMA 2']];
    for (const [tape, name] of groups) {
      const list = EPISODE_LIST.filter((e) => e.tape === tape);
      const done = list.filter((e) => save.isDone(e.id)).length;
      const t = document.createElement('h3');
      t.textContent = tape === 0 ? name : `${name} · ${done}/${list.length}`;
      el.appendChild(t);
      const row = document.createElement('div'); row.className = 'shelf';
      for (const e of list) {
        const b = document.createElement('button');
        const open = isUnlocked(e.id);
        b.className = `${open ? '' : 'locked'} ${save.isDone(e.id) ? 'done' : ''}`;
        b.disabled = !open;
        b.title = e.title || '';
        b.innerHTML = `<b>${tape === 0 ? 'P' : String(e.index).padStart(2, '0')}</b><small>${
          save.isDone(e.id) ? `✓ ${Math.round(save.best(e.id) * 100)}%` : open ? '▶' : '🔒'}</small>`;
        b.onclick = () => { close(); onPick(e.id); };
        row.appendChild(b);
      }
      el.appendChild(row);
    }
    const foot = document.createElement('p'); foot.className = 'foot';
    const reset = document.createElement('button'); reset.className = 'plain'; reset.textContent = 'Wyczyść zapis';
    reset.onclick = () => { if (confirm('Usunąć cały postęp?')) { save.reset(); build(); } };
    const x = document.createElement('button'); x.className = 'plain'; x.textContent = 'Zamknij (M / Esc)';
    x.onclick = close;
    foot.append(x, reset); el.appendChild(foot);
  };
  const toggle = () => { el.hidden = !el.hidden; if (!el.hidden) build(); };
  window.addEventListener('keydown', (e) => {
    if (state.flags.typing || document.getElementById('start')) return;
    if (e.key.toLowerCase() === 'm') toggle();
    else if (e.key === 'Escape') close();
  });
  return { open() { build(); el.hidden = false; }, toggle };
}
