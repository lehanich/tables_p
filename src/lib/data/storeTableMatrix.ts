import { writable } from 'svelte/store';
import { browser } from "$app/environment";
import Matrix from "./base/Matrix";

export const tableStoreMatrix = (key, initial: any[]) => {                 // receives the key of the local storage and an initial value
  let tableData = new Matrix(...initial); 
  //(initial[0],initial[1],initial[2])//(...initial);

  // for (let i=0; i < initial; i++) {
  //   tableData.push([])
  // }

  const { subscribe, set, update } = writable(tableData);
  
  return {
      subscribe,
      set: (value) => {
        // console.log(2, value)
        // browser ? localStorage.setItem(key, toString(value)) : value              // save also to local storage as a string
        // const {x, y, val} = value
        // tableData.setElement(x, y, val);
        // tableData=tableData;
        return set(value)
      },
      // update(updater) {
      //   let newValue: T;
      //   underlyingStore.update(currentValue => {
      //       newValue = updater(currentValue);
      //       return newValue;
      //   });
      //   channel.postMessage(newValue);
      // },
      // update: (value) => {
      //   // browser ? localStorage.setItem(key, toString(value)) : value;
      //   console.log(1, value)
      //   return value;
      // }
      update,
      areaModify(area, delta) {
        return tableData.areaModify(area, delta);
      },
      getMatrix(area) {
        return tableData.getMatrix(area);
      },
      getElement(x,y) {
        return tableData.getElement(x,y);
      },
      set setElement(val) {
        const {x, y, value} = val
        tableData.setElement(x, y, value);
        tableData=tableData;
      },
      updateMatrix(area, buffer) {
        tableData.updateMatrix(area, buffer);
        tableData=tableData;
      },
      print() {
        return tableData.print();
      }
  }
  
}
