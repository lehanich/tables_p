// import { writable } from 'svelte/store';
import { tableStore } from './storeTable';
import { tableStoreMatrix } from './storeTableMatrix';
import { coordinatesStore } from "./storeCoordinates";
import { cellInputStore } from "./storeCellInput";
import { historyStore } from './storeHistory';

export const stateTable = tableStore("table", 21);
export const stateCoordinates = coordinatesStore();
export const inputStore = cellInputStore("cellInput", "");
export const stateTableMatrix = tableStoreMatrix("matrix", [26, 21, ""]);
export const stateTableMeta = tableStoreMatrix("matrix", [26,21, {}]);
export const stateHistory = historyStore();
