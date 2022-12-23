import { writable } from 'svelte/store';
import { browser } from "$app/environment";

export const tableStore = (key, initial: number) => {                 // receives the key of the local storage and an initial value
  const tableData = [];

  for (let i=0; i < initial; i++) {
    tableData.push([])
  }

  const { subscribe, set, update } = writable(tableData)
  
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
