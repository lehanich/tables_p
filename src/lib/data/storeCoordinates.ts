import { writable } from 'svelte/store';
import { toChar } from "../tableHeplers";

export const coordinatesStore = () => {
  const data: App.Coordinates = {
    select: [[0,1],[0,1]],
    selectName: [['A',1],['A',1]],
    // selectPx: {
    //   height: 0,
    //   left: 0,
    //   top: 0,
    //   width: 0
    // },
    borderCover: {
      height: 0,
      left: 0,
      top: 0,
      width: 0
    },
    selectCell: {
      height: 0,
      left: 0,
      top: 0,
      width: 0
    },
    selectSpace: {
      height: 0,
      left: 0,
      top: 0,
      width: 0
    },
    editCellCols: [0, 1],
    editCell: {
      height: 0,
      left: 0,
      top: 0,
      width: 0
    },
    selectFormulaSpace: {
      height: 0,
      left: 0,
      top: 0,
      width: 0
    },
    selectFormulaBorder: {
      height: 0,
      left: 0,
      top: 0,
      width: 0
    },
    functionCell: null
  };

  const store = writable(data);

  return {
    subscribe: store.subscribe,
    update: store.update,
    set: (value: App.Coordinates) => {
      return store.set(value)
    },
    get: () => {
      return data;
    },
    setSelectFirst: (value: [number, number]) => {
      store.update(store => {
        store.select[0] = [...value];
        return store;
      })
    },
    setSelectSecond: (value: [number, number]) => {
      store.update(store => {
        store.select[1] = [...value];
        return store;
      });
    },
    setSelectNameFirst: (value: [string, number]) => {
      store.update(store => {
        store.selectName[0] = [...value];
        return store;
      })
    },
    setSelectNameSecond: (value: [string, number]) => {
      store.update(store => {
        store.selectName[1] = [...value];
        return store;
      });
    },
    addDeltaCoordinates:(value: [number, number]) => {
      store.update(store => {
        store.selectSpace.left += value[0];
        store.selectSpace.top += value[1];

        store.selectCell.left += value[0];
        store.selectCell.top += value[1];

        store.borderCover.left += value[0];
        store.borderCover.top += value[1];

        return store;
      });
    },
    addDeltaCols:(value: [number, number]) => {
      store.update(store => {
        store.select[0][0] += value[0];
        store.select[1][0] += value[0];
        
        store.select[0][1] += value[1];
        store.select[1][1] += value[1];

        return store;
      });
    },
    collRange: () => {
      console.log(data)
      return [[
        Math.min(data.select[0][0], data.select[1][0]),
        Math.min(data.select[0][1], data.select[1][1])
      ],[
        Math.max(data.select[0][0], data.select[1][0]),
        Math.max(data.select[0][1], data.select[1][1])
      ]]
    },
    collRangeName: () => {
      return [[
        String.fromCharCode(
          Math.min(data.selectName[0][0].charCodeAt(0), data.selectName[1][0].charCodeAt(0))),
        Math.min(data.selectName[0][1], data.selectName[1][1])
      ],[
        String.fromCharCode(
          Math.max(data.selectName[0][0].charCodeAt(0), data.selectName[1][0].charCodeAt(0))),
        Math.max(data.selectName[0][1], data.selectName[1][1])
      ]]
    }
  }
}