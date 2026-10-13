// jsdom has no ResizeObserver; ReactFlow needs one to measure its canvas. A
// no-op stub is enough — tests assert node/edge content, not live layout.
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
