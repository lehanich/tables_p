<!-- <svelte:options accessors immutable/> -->

<script lang="ts">
  import { afterUpdate, beforeUpdate, onMount } from 'svelte';
  import { stateTableMatrix, stateTableMeta, inputStore, stateCoordinates as sCoords } from "../../lib/data/stores";
  import FormulaStart from "../../lib/formula/FormulaStart";
  
  export let cell: HTMLDivElement;
  export let html: string = "";

  const { value, row, column, mode } = $$props
  let selection;

  function handleSelect(e) {
    console.log("selection", e);
  }

  afterUpdate(() => {
    console.log("selection 2 ",
      document.getSelection(),
      document.getSelection()?.getRangeAt(0),
      document.getSelection()?.toString())
    // let res = myRe.exec($inputStore);
    console.log("formula 1", $inputStore, /^=/g.test($inputStore));
    if (/^=/g.test($inputStore)) {

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
      $stateTableMatrix
        .update($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1)
        .element = $inputStore;

      $stateTableMatrix = $stateTableMatrix;
    }
  })
  
  const onLoad = async () => {
    cell.focus();
    cell.addEventListener(`selectionchange`, () => {
      selection = document.getSelection();
    });
    console.log("777 mode", mode)
    // setCaretPosition(cell, text.length);
  }

  onMount(onLoad);
</script>

<template lang="pug">
  div.cellEdit(
    contenteditable
    test="textbox"
    role="combobox"
    data-row="{row}"
    data-column="{column}"
    bind:innerHTML='{$inputStore}'
    bind:this='{cell}'
    on:selectionchange='{handleSelect}'
    style="display: inline-block; width: 100%;"
    style:font-weight='{$stateTableMeta.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1).styles?.fontWeight}'
    style:font-style='{$stateTableMeta.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1).styles?.fontStyle}'
    style:text-decoration='{$stateTableMeta.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1).styles?.textDecoration}'
    style:text-align='{$stateTableMeta.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1).styles?.textAlign}'
  )
    slot
</template>

<style lang="scss">
  @import "./cellEdit.scss";
</style>
