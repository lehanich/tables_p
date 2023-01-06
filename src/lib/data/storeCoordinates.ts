import { writable } from 'svelte/store';

export const coordinatesStore = () => {
  const data: Coordinates = {
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
    }
  };

  const store = writable(data);

  return {
    subscribe: store.subscribe,
    update: store.update,
    set: (value) => {
      return store.set(value)
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
    setSelectNameFirst: (value: [number, number]) => {
      store.update(store => {
        store.selectName[0] = [...value];
        return store;
      })
    },
    setSelectNameSecond: (value: [number, number]) => {
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
  }
}