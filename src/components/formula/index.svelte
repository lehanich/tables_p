<svelte:window on:keydown={handleKeydown} />

<script lang="ts">
  import { onMount,
    setContext,
    afterUpdate,
    beforeUpdate,
    tick } from 'svelte';
	// import { beforeUpdate } from 'svelte/types/runtime/internal/lifecycle';
  import { stateTableMatrix,
    stateTableMeta,
    stateCoordinates as sCoords,
    inputStore } from "../../lib/data/stores";
  import FormulaParser, {ParserMathCols} from "../../lib/formula/FormulaParser";
  import {createEventbusDispatcher} from '../../lib/eventBus';

  const dispatch = createEventbusDispatcher();

  let historyOldVal: string;
  let keyDown

  var myRe ;
  var myArray ;

  $: {
    myRe = /^=/g;
    myArray = myRe.exec($inputStore);

    if(historyOldVal !== $inputStore && keyDown) {
      dispatch('setHistory', {
        type: myArray?.index === 0 ? "input_formula" : "input_text",
        parameter: myArray?.index === 0 ? "input" : "text",
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
    // console.log("history key",e);
    // console.log('history currentColor:', $inputStore, 'prevColor:', historyOldVal);
    keyDown = true;
  }

  afterUpdate(() => {
    if (myArray?.index === 0) {
      var myRe2 = /^=SUM\((\w)(\d):(\w)(\d)\)/g;
      var myArray2 = myRe2.exec($inputStore);

      let meta =  $stateTableMeta
        .getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1);
      if (!meta) {meta = {}; }

      meta.formula =  $inputStore;
      $stateTableMeta
        .setElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1, meta)
      $stateTableMeta = $stateTableMeta;

      let test = new FormulaParser(new ParserMathCols($inputStore, $stateTableMatrix, ()=>{}));

      $stateTableMatrix
        .update($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1)
        .element = test.exec();test.exec();

      $stateTableMatrix = $stateTableMatrix;
    } else {
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