import { writable } from 'svelte/store';
import LinkStack from './base/LinkStack/LinkStack';

type T = any;

export const historyStore = () => {
  const data: LinkStack<T> = new LinkStack();
  const store = writable(data);

  return {
    subscribe: store.subscribe,
    update: store.update,
    set: (value: any) => {
      return store.set(value)
    },
    get: () => {
      return data;
    }
  }
}
