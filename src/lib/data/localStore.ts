import { writable } from 'svelte/store';
import { browser } from "$app/environment";

export const localStore = (key, initial) => {

  const toString = (value) => JSON.stringify(value, null, 2);
  const toObj = JSON.parse;
  let saved = {}

  if (browser){
    if (localStorage.getItem(key) === null) {
      localStorage.setItem(key, toString(initial));
    }

    saved = toObj(localStorage.getItem(key));
  }

  const { subscribe, set, update } = writable(saved)

  return {
    subscribe,
    set: (value) => {
      browser ? localStorage.setItem(key, toString(value)) : value
      return set(value)
    },
    update
  }
}
