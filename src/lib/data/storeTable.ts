import { writable } from 'svelte/store';
import { browser } from "$app/environment";
import { toChar } from "../tableHeplers";

export const tableStore = (key: string, initial: number) => {                 // receives the key of the local storage and an initial value
  const CODES = {
    A: 65,
    Z: 90,
  }
  const tableStructure = {
    CODES,
    colsCount: CODES.Z - CODES.A + 1,
    cols: [],
    rows: [],
    cells: [],
  };

  const { subscribe, set, update } = writable(tableStructure);
  
  for(let i=0; i< tableStructure.colsCount; i++) { tableStructure.cols.push(toChar(tableStructure.cols,i))}
  for(let i=0; i< initial; i++) { tableStructure.rows.push("")}

  return {
      subscribe,
      set: (value) => {
       return set(value)
      },
      update
  }
  
}
