import { state, kick } from '../core/state.js';
import { bus } from '../core/bus.js';

/**
 * Location manager: each location is { scene, hotspots, nodes, startCamera, update(t, madness, raised), setHover(id) }.
 * Locations are built lazily (own chunk), cached, and the actors are moved into whichever scene is current.
 */
const loaders = {
  las: async () => (await import('./locations/las.js')).buildLas(),
  podworko: async () => (await import('./locations/podworko.js')).buildPodworko(),
  ogrod: async () => (await import('./locations/ogrod.js')).buildOgrod(),
  poddasze: async () => (await import('./locations/poddasze.js')).buildPoddasze(),
  zima: async () => (await import('./locations/zima.js')).buildZima(),
  piwnica: async () => (await import('./locations/piwnica.js')).buildPiwnica(),
  strych: async () => (await import('./locations/strych.js')).buildStrych(),
  lazienka: async () => (await import('./locations/lazienka.js')).buildLazienka(),
};

export function createWorld({ rig, actors, initial }) {
  const cache = new Map([['chata', initial]]);
  let current = initial, id = 'chata';
  state.location = id;
  return {
    get current() { return current; },
    get id() { return id; },
    /** Switches to a location (and camera node). No-op when already there and no camera is requested. */
    async go(locId, camId) {
      if (locId === id && !camId) return current;
      let loc = cache.get(locId);
      if (!loc) {
        loc = await loaders[locId]?.();
        if (!loc) throw new Error(`unknown location: ${locId}`);
        cache.set(locId, loc);
      }
      current = loc; id = locId; state.location = locId;
      actors.attach(loc.scene);
      rig.setNodes(loc.nodes);
      rig.goTo(camId && loc.nodes[camId] ? camId : loc.startCamera);
      kick(0.8);
      bus.emit('location', locId);
      return loc;
    },
  };
}
