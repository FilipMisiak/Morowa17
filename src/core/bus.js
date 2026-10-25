// Tiny event bus. Interactions emit 'interact:<hotspotId>', cameras emit 'camera:<id>', etc.
const handlers = new Map();
export const bus = {
  on(type, fn) {
    if (!handlers.has(type)) handlers.set(type, new Set());
    handlers.get(type).add(fn);
    return () => handlers.get(type)?.delete(fn);
  },
  emit(type, data) { handlers.get(type)?.forEach((fn) => fn(data)); },
  once(type) { return new Promise((res) => { const off = bus.on(type, (d) => { off(); res(d); }); }); },
};
