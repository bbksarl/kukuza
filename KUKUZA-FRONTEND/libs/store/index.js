// Simple shared store placeholder - implement according to your chosen lib (Redux, Zustand, RxJS...)
export const createStore = () => {
  const state = {};
  const subscribers = [];
  return {
    getState: () => state,
    subscribe: (cb) => { subscribers.push(cb); },
    setState: (patch) => {
      Object.assign(state, patch);
      subscribers.forEach(s => s(state));
    }
  };
};
