import { state } from '../core/state.js';
import { bus } from '../core/bus.js';

/** Items the Cameraman carries. Tape and battery are used instantly from the bar; the rest are picked, then used on a hotspot. */
export const ITEMS = {
  kaseta:   { label: 'KASETA VHS' },
  bateria:  { label: 'BATERIA' },
  wegiel:   { label: 'WĘGIEL' },
  klodka:   { label: 'KŁÓDKA' },
  przysmak: { label: 'PRZYSMAK' },
};

export const count = (id) => state.inventory[id] ?? 0;

export function give(id, n = 1) {
  state.inventory[id] = count(id) + n;
  bus.emit('inventory');
}

/** Consumes one item; returns false if there was none. */
export function take(id, n = 1) {
  if (count(id) < n) return false;
  state.inventory[id] -= n;
  if (state.selected === id && count(id) === 0) state.selected = null;
  bus.emit('inventory');
  return true;
}

export function select(id) {
  state.selected = state.selected === id ? null : id;
  bus.emit('inventory');
}
