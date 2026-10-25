import { state, addMadness } from '../core/state.js';

/**
 * Passive madness rules (0..1); camcorder.js adds the lens-related ones and duties.js the missed-chore ones.
 * - staying on a camera with a dark corner in frame drains sanity
 * - slow natural recovery
 */
export function updateSanity(dt, cameraNode) {
  if (state.level !== 'running') return;
  let d = -0.004;
  if (cameraNode?.dark) d += 0.018;
  addMadness(d * dt);
}
