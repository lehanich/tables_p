<!-- <svelte:options accessors immutable/> -->

<script lang="ts">
  import { afterUpdate, beforeUpdate, onMount } from 'svelte';
  import { stateTableMatrix, stateTableMeta, inputStore, stateCoordinates as sCoords } from "../../lib/data/stores";
  
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
