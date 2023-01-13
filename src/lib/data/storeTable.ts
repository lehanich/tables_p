import { writable } from 'svelte/store';
// import { browser } from "$app/environment";
import { toChar } from "../tableHeplers";
import Matrix from './base/Matrix/Matrix';

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
    cells: Matrix<object>
  };
  
  for(let i=0; i< tableStructure.colsCount; i++) { tableStructure.cols.push(toChar(tableStructure.cols,i))}
  for(let i=0; i< initial; i++) { tableStructure.rows.push(i)}

  tableStructure.cells = new Matrix(tableStructure.cols.length, tableStructure.rows.length, {});

  const store = writable(tableStructure);

  return {
      subscribe: store.subscribe,
      set: (value) => {
       return store.set(value)
      },
      get: () => {
        return tableStructure;
      },
      update: store.update,
      unionCols:(value: App.CoordinatesArea<App.Coordinate>) => {
        store.update(store => {
          console.log("table", store)
          store.cells.unionElements(value);
          return store;
        });
      },
      separateCols:(value: App.CoordinatesArea<App.Coordinate>) => {
        store.update(store => {
          store.cells.separateElements(value);
          return store;
        });
      },
  }
  
}
