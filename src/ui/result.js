import { state } from '../core/state.js';

/** End-of-level card: tape saved (next episode) or tape lost (retry). */
export function createResult({ onRetry, onNext }) {
  const el = document.getElementById('result');
  return {
    show({ won, reason, next, need }) {
      const cov = Math.round(state.coverage * 100);
      el.innerHTML = `<div><h2>${won ? 'TAŚMA ZAPISANA' : 'TAŚMA STRACONA'}</h2>
        <p>Nagrany materiał: ${cov}%${need ? ` (wymagane ${Math.round(need * 100)}%)` : ''}${reason ? `<br>${reason}` : ''}</p>
        ${won && next ? '<button data-a="next">▶ NASTĘPNY DZIEŃ</button>' : ''}
        <button data-a="retry">↺ POWTÓRZ DZIEŃ</button></div>`;
      el.hidden = false;
      el.onclick = (e) => {
        const a = e.target.dataset?.a;
        if (!a) return;
        el.hidden = true;
        (a === 'next' ? onNext : onRetry)();
      };
    },
    hide() { el.hidden = true; },
  };
}
