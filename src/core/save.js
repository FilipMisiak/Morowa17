// Progress persistence (localStorage). Every access is guarded: private mode / blocked storage must not break the game.
const KEY = 'morowa17.save.v1';
const empty = () => ({ done: {}, last: null }); // done: episodeId -> best coverage 0..1

let data = empty();
try {
  const raw = JSON.parse(localStorage.getItem(KEY) ?? 'null');
  if (raw && typeof raw.done === 'object') data = { done: raw.done, last: raw.last ?? null };
} catch { /* start fresh */ }

const flush = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* ignore */ } };

export const save = {
  isDone: (id) => id in data.done,
  best: (id) => data.done[id] ?? 0,
  last: () => data.last,
  hasProgress: () => data.last !== null || Object.keys(data.done).length > 0,
  /** Remember the episode being played (for "continue"). */
  visit(id) { data.last = id; flush(); },
  /** Tape saved: keep the best coverage. */
  complete(id, coverage) { data.done[id] = Math.max(data.done[id] ?? 0, coverage); flush(); },
  reset() { data = empty(); flush(); },
};
