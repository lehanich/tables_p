/* eslint-disable no-self-assign */
import { writable } from 'svelte/store';
import { browser } from "$app/environment";
import Matrix from "./base/Matrix/Matrix";

type T = "" | object;

export const tableStoreMatrix = (key: string, initial: [number, number, "" | object]) => {                 // receives the key of the local storage and an initial value
  let tableData: App.Matrix<T> = new Matrix(...initial); 
  const { subscribe, set, update } = writable(tableData);

  return {
      subscribe,
      set: (value: App.Matrix<T>) => {
        return set(value);
      },
      update,
      areaModify(area: App.CoordinatesArea<App.Coordinate>, delta: App.Coordinate) {
        return tableData.areaModify(area, delta);
      },
      getMatrix(area: App.CoordinatesArea<App.Coordinate>) {
        return tableData.getMatrix(area);
      },
      getElement(x: number, y: number) {
        return tableData.getElement(x,y);
      },
      set setElement(val: {x: number, y: number, value: T}) {
        const {x, y, value} = val
        tableData.setElement(x, y, value);
        tableData = tableData;
      },
      updateMatrix(area: App.CoordinatesArea<App.Coordinate>, buffer: App.Matrix<T>) {
        tableData.updateMatrix(area, buffer);
        tableData = tableData;
      },
      print() {
        return tableData.print();
      }
  }
  
}
