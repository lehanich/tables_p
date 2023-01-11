import { writable } from 'svelte/store';

export const cellInputStore = (key: string, initial: string) => {                 // receives the key of the local storage and an initial value

  const { subscribe, set, update } = writable(initial);

  return {
      subscribe,
      set: (value: string) => {
        return set(value)
      },
      update
  }
}
