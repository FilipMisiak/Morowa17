import { state } from '../core/state.js';
import { bus } from '../core/bus.js';
import { ITEMS, count, select } from '../systems/inventory.js';

const $ = (id) => document.getElementById(id);
const pct = (v) => `${Math.round(Math.max(0, Math.min(1, v)) * 100)}%`;
const NAMES = { konon: 'Konon', major: 'Major' };

export function createHud(rig, recording, camcorder) {
  const cams = $('hud-cams');
  const renderCams = () => {
    cams.innerHTML = '';
    Object.entries(rig.nodes()).filter(([, n]) => !n.scripted).forEach(([id, n], i) => {
      const b = document.createElement('button');
      b.textContent = `${i + 1} ${n.label}`;
      b.className = id === state.cameraId ? 'on' : '';
      b.onclick = () => { if (!state.cam.raised) rig.goTo(id); };
      cams.appendChild(b);
    });
  };
  bus.on('camera', renderCams);
  window.addEventListener('keydown', (e) => {
    if (state.flags.typing) return;
    const n = Number(e.key);
    const ids = Object.entries(rig.nodes()).filter(([, n]) => !n.scripted).map(([id]) => id);
    if (n >= 1 && n <= ids.length && !state.cam.raised) rig.goTo(ids[n - 1]);
  });
  renderCams();

  // inventory bar
  const items = $('hud-items');
  const renderItems = () => {
    items.innerHTML = '';
    for (const [id, it] of Object.entries(ITEMS)) {
      if (!count(id)) continue;
      const b = document.createElement('button');
      b.textContent = `${it.label} ×${count(id)}`;
      b.className = state.selected === id ? 'on' : '';
      b.onclick = () => bus.emit('item:click', id);
      items.appendChild(b);
    }
  };
  bus.on('inventory', renderItems);
  bus.on('item:click', (id) => {
    if (id === 'kaseta' || id === 'bateria') bus.emit('item:reload', id);
    else select(id);
  });
  $('hud-rec-btn').onclick = () => camcorder.toggle();

  // toast
  let toastTimer = 0;
  bus.on('toast', (text) => {
    const el = $('hud-toast');
    el.textContent = text;
    el.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('on'), 2200);
  });
  bus.on('cam:empty', () => bus.emit('toast', 'KONIEC TAŚMY / BATERII — użyj zapasu'));

  const meters = $('hud-meters');
  const meter = (label, v, bad = false) => `<div class="m"><span>${label}</span><div class="bar ${bad ? 'bad' : ''}"><span style="width:${pct(v)}"></span></div></div>`;

  return {
    show() { $('hud').hidden = false; renderItems(); },
    hint(text) { $('hud-hint').textContent = text ?? ''; },
    update() {
      const s = Math.floor(state.tapeSeconds);
      const p = (v) => String(v).padStart(2, '0');
      $('hud-time').textContent = `${p(Math.floor(s / 3600))}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}`;

      meters.innerHTML =
        meter('MATERIAŁ', state.coverage) +
        meter('OBŁĘD', state.madness, state.madness > 0.7) +
        meter('PIEC', state.fire, state.fire < 0.2) +
        `<div class="m"><span>BŁĘDY</span><span>${'✖'.repeat(state.strikes)}${'·'.repeat(Math.max(0, 3 - state.strikes))}</span></div>`;

      const vf = $('vf');
      vf.hidden = !state.cam.raised;
      if (state.cam.raised) {
        const h = recording.hint();
        vf.classList.toggle('ok', !!h?.ok);
        $('vf-hint').textContent = !h ? '' : h.ok ? `● NAGRYWASZ: ${h.who.map((w) => NAMES[w] ?? w).join(' + ')}` : `SCENA POZA KADREM ${h.dir}`;
        $('vf-stats').textContent = `TAŚMA ${pct(state.cam.tape)}  BAT ${pct(state.cam.battery)}  ZOOM ×${state.cam.zoom.toFixed(1)}`;
      }
      $('hud-rec').style.opacity = state.cam.raised ? 1 : 0.45;
    },
  };
}
