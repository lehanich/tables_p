<svelte:window on:keydown={handleKeydown} />

<script lang="ts">
  import { onMount,
    setContext,
    afterUpdate,
    beforeUpdate,
    tick } from 'svelte';
  import { stateTableMatrix,
    stateTableMeta,
    stateCoordinates as sCoords,
    inputStore } from "../../lib/data/stores";
  import FormulaStart from "../../lib/formula/FormulaStart";
  import {createEventbusDispatcher} from '../../lib/eventBus';

  const dispatch = createEventbusDispatcher();

  let historyOldVal: string;
  let keyDown

  $: {
    if(historyOldVal !== $inputStore && keyDown) {
      dispatch('setHistory', {
        type: $inputStore.substring(0, 1) === "=" ? "input_formula" : "input_text",
        parameter: $inputStore.substring(0, 1) === "=" ? "input" : "text",
        valueRedo: $inputStore,
        valueUndo: historyOldVal,
        coordinate: [$sCoords.editCellCols[0], $sCoords.editCellCols[1]],
        coordinates: [
          [$sCoords.select[0][0],$sCoords.select[0][1]],
          [$sCoords.select[1][0],$sCoords.select[1][1]]
        ] //selectFormulaSpace
      });
      keyDown = false;
    }

    historyOldVal = $inputStore;
  };

  function handleKeydown(e) {
    keyDown = true;
  }

  afterUpdate(() => {
    if ($inputStore.substring(0, 1) === "=") {

      let meta =  $stateTableMeta
        .getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1);
      if (!meta) {meta = {}; }

      console.log("formula input ",$inputStore)
      meta.formula =  $inputStore;
      $stateTableMeta
        .setElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1, meta)
      $stateTableMeta = $stateTableMeta;

      console.log("formula meta ",$stateTableMeta
        .getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1))
      $stateTableMatrix
        .update($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1)
        .element = FormulaStart($inputStore, $stateTableMatrix, null);

      $stateTableMatrix = $stateTableMatrix;
    } else {
      console.log("write to data")
      $stateTableMatrix
        .update($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1)
        .element = $inputStore;

      $stateTableMatrix = $stateTableMatrix;
    }
  })

</script>

<template lang="pug">
  div.formula
    div.info
    div.input(
      contenteditable
      spellcheck="false"
      bind:innerHTML="{$inputStore}"
      on:keydown='{handleKeydown}'
    )
</template>

<style lang="scss" module>
  @import "./formula.scss";
</style>
