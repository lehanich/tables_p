<script>
  export const prerender = true;
  import { onMount } from 'svelte';
  import Eventbus from '../components/base/EventBus.svelte';
  import Header from "../components/header/index.svelte";
  // @ts-ignore
  import Toolbar from "../components/toolbar/index.svelte";
  import Formula from "../components/formula/index.svelte";
  import Table from "../components/table/index.svelte";
  import Footer from "../components/footer/index.svelte";
  import Matrix from '../lib/data/base/Matrix/Matrix';
  import {
    stateTableMeta,
    stateTableMatrix,
    stateCoordinates as sCoords,
    inputStore,
    stateHistory } from "../lib/data/stores";

  let showEditCell;

  const handleShowEditCell = (e) => {
    console.log("777",e)
    showEditCell = true;
    console.log("777 444", showEditCell)
    // setTimeout(() => {
    //   showEditCell = false
    // }, 500);
  }

  const handleSetHistory = (e) => {
    $stateHistory.push(e.detail);
    console.log("history print", $stateHistory.print());
  }

  const handleReadHistory = (e) => {
    console.log("history read",e.detail)
    let obj;
    let state;
    let value

    if (e.detail === "undo") {
      state = $stateHistory.readNext();
      value = state.valueUndo;
    } else {
      state = $stateHistory.readPrev();
      value = state.valueRedo;
    }
    
    switch (state.type) {
        case "style":
          obj = $stateTableMeta.getElement(state.coordinates[0][0],state.coordinates[0][1]-1);
          obj.styles[state.parameter] = value;
          $stateTableMeta.setElement(
            state.coordinates[0][0],
            state.coordinates[0][1]-1,
            obj
          );
          console.log("history", $stateTableMeta.print())
          $stateTableMeta = $stateTableMeta;
          break;

        case "input_text":
          if ($sCoords.editCellCols[0] === state.coordinate[0] &&
              $sCoords.editCellCols[1] === state.coordinate[1]) {
            $inputStore = value;
          } else {
            $stateTableMatrix.setElement(state.coordinate[0],state.coordinate[1]-1, value); 
            stateTableMatrix.update($stateTableMatrix => $stateTableMatrix);
            $stateTableMatrix = $stateTableMatrix;
          }
          break;

        case "input_formula":
          if ($sCoords.editCellCols[0] === state.coordinate[0] &&
              $sCoords.editCellCols[1] === state.coordinate[1]) {
            $inputStore = value;
          } else {
            obj = $stateTableMeta.getElement(state.coordinate[0],state.coordinate[1]-1);
            obj.formula = value;
            $stateTableMeta.setElement(
              state.coordinate[0],
              state.coordinate[1]-1,
              obj
            );
            $stateTableMeta = $stateTableMeta;
          }
          break;

        case "moveArea":
          let coords = $stateTableMatrix.areaModify(value.coordinates, value.coordinate);
          let coords2 = $stateTableMatrix.areaModify(value.coordinates, [0,0]);

          $stateTableMatrix.updateMatrix(coords, value.buffer);
          $stateTableMeta.updateMatrix(coords, value.bufferMeta);

          if (e.detail === "undo") { //( value.bufferBackup && value.bufferBackupMeta){
            $stateTableMatrix.updateMatrix(coords2, value.bufferBackup);
            $stateTableMeta.updateMatrix(coords2, value.bufferBackupMeta);
          } else {
            let x = coords2[1][0] - coords2[0][0] + 1;
            let y = coords2[1][1] - coords2[0][1] + 1;
            let matrix = new Matrix(x, y, "");
            let matrixMeta = new Matrix(x, y, {});

            $stateTableMatrix.updateMatrix(coords2, matrix);
            $stateTableMeta.updateMatrix(coords2, matrixMeta);
          }

          $stateTableMeta = $stateTableMeta;
          $stateTableMatrix = $stateTableMatrix;
          break;

        default:
          break;
    }
  }

  const onLoad = async () => {
  //   const SyncWorker = await import('$lib/my.js?worker');
  //   syncWorker = new SyncWorker.default();

  //   syncWorker.postMessage({});
  };

  onMount(onLoad);
</script>


<template lang="pug">
  Eventbus(
    on:showEditCell='{handleShowEditCell}'
    on:setHistory='{handleSetHistory}'
    on:readHistory='{handleReadHistory}'
  )
    Header
    Toolbar
    Formula
    Table(
      bind:showEditFormula='{showEditCell}'
    )
    Footer
</template>

<style lang="scss" module>

</style>