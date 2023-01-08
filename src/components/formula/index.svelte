<script lang="ts">
  import { onMount, setContext, afterUpdate, tick } from 'svelte';
  import { stateTableMatrix, stateCoordinates as sCoords, inputStore } from "../../lib/data/stores";

  afterUpdate(() => {
    console.log("999 22 ",$sCoords.editCellCols)
    // $stateTable[$stateCoordinates.select[0][1]-1][$stateCoordinates.select[0][0]] = $inputStore

    // $stateTableMatrix
    //   .update( $sCoords.select[0][0], $sCoords.select[0][1]-1)
    //   .element = $inputStore

    // console.log("999 2 1",$stateTableMatrix.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1))
    // console.log("999 2 2",$stateTableMatrix.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]))
    // console.log("999 2 3",$stateTableMatrix.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]+1))
    $stateTableMatrix
      .update($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1)
      .element = $inputStore

    $stateTableMatrix = $stateTableMatrix
    console.log($inputStore)
    // console.log($stateTable[$stateCoordinates.select[0][1]-1][$stateCoordinates.select[0][0]])
  })

  // $stateTable[$stateCoordinates.select[0][0]][$stateCoordinates.select[0][1]] = $inputStore

</script>

<template lang="pug">
  div.formula
    div.info
    div.input(
      contenteditable
      spellcheck="false"
      bind:innerHTML="{$inputStore}"
    )
</template>

<style lang="scss" module>
  @import "./formula.scss";
</style>