import { writable } from 'svelte/store';

export const cellInputStore = (key, initial: string) => {                 // receives the key of the local storage and an initial value

  const { subscribe, set, update } = writable(initial);
  
  return {
      subscribe,
      set: (value) => {
        console.log(2, value)
        // browser ? localStorage.setItem(key, toString(value)) : value              // save also to local storage as a string
        return set(value)
      },
      // update(updater) {
      //   let newValue: T;
      //   underlyingStore.update(currentValue => {
      //       newValue = updater(currentValue);
      //       return newValue;
      //   });
      //   channel.postMessage(newValue);
      // },
      // update: (value) => {
      //   // browser ? localStorage.setItem(key, toString(value)) : value;
      //   console.log(1, value)
      //   return value;
      // }
      update
  }
}
