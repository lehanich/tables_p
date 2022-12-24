import { writable } from 'svelte/store';

export const coordinatesStore = () => {
  const data = {
    select: [[0,0],[0,0]]
  };

  const store = writable(data);

  return {
    subscribe: store.subscribe,
    update: store.update,
    set: (value) => {
      return store.set(value)
    },
    setSelectFirst: (value: [number, number]) => {
      store.update(store => {
        store.select[0] = [...value]
        return store;
      })
    },
    setSelectSecond: (value: [number, number]) => {
      store.update(store => {
        store.select[1] = [...value]
        return store;
      });
    }
  }
}