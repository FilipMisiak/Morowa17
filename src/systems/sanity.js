import { state, addMadness } from '../core/state.js';

/**
 * Passive madness rules (0..1); camcorder.js adds the lens-related ones and duties.js the missed-chore ones.
 * - staying on a camera with a dark corner in frame drains sanity
 * - the house creeps on you: a steady rise that grows with the level (chores and letters are what hold it back)
 */
export function updateSanity(dt, cameraNode) {
  if (state.level !== 'running') return;
  let d = 0.0006 + 0.00025 * (state.levelNo - 1);
  if (cameraNode?.dark) d += 0.018;
  addMadness(d * dt);
}
