import { writable } from 'svelte/store';
import { tableStore } from './storeTable';
import { tableStoreMatrix } from './storeTableMatrix';
import { coordinatesStore } from "./storeCoordinates";
import { cellInputStore } from "./storeCellInput";
// export const alert = writable('Welcome to the to-do list app!')

// const initialTodos = [
//   { id: 1, name: 'Visit MDN web docs', completed: true },
//   { id: 2, name: 'Complete the Svelte Tutorial', completed: false },
// ]

// export const todos = localStore('mdn-svelte-todo', initialTodos)
export const stateTable = tableStore("table", 21);
export const stateCoordinates = coordinatesStore();
export const inputStore = cellInputStore("cellInput", "");
export const stateTableMatrix = tableStoreMatrix("matrix", [26, 21, ""]);
export const stateTableMeta = tableStoreMatrix("matrix", [26,21, {}]);
