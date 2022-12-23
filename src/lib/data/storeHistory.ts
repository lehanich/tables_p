import { writable } from 'svelte/store';

class HistoryStore {
  constructor() {
    this._history = writable([])
  }

  parse(string) {
    this._history.update(v => [...v, string])
  }
    
  subscribe(run) {
    return this._history.subscribe(run);
  }
}

export const historyStore = new HistoryStore();
