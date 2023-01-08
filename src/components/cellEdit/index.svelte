<!-- <svelte:options accessors immutable/> -->

<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';
  import { stateTableMatrix, stateTableMeta, inputStore, stateCoordinates as sCoords } from "../../lib/data/stores";
  import { setCaretPosition } from "../../lib/helpers";

  export let cell: HTMLDivElement;
  export let html: string = "";

  const { value, row, column, mode } = $$props
  let selection;

  function handleSelect(e) {
    console.log("999", e);
  }

  afterUpdate(() => {
    // html = html ?? value;
    // console.log("999 $sCoords", $sCoords.editCellCols)
    // $stateTableMatrix
    //   .update($sCoords.select[0][0], $sCoords.select[0][1]-1)
    //   .element = $inputStore;
    $stateTableMatrix
      .update($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1)
      .element = $inputStore;

    $stateTableMatrix = $stateTableMatrix
    // console.log($inputStore)
    // console.log("999 1",$stateTableMatrix.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1))
    // console.log("999 2",$stateTableMatrix.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]))
    // console.log("999 3",$stateTableMatrix.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]+1))
    // console.log("999 selection ", selection)
    console.log("999 selection 2 ",
      document.getSelection(),
      document.getSelection()?.getRangeAt(0),
      document.getSelection()?.toString())
    // console.dir(cell)

    var myRe = /^=/g;
    var myArray = myRe.exec($inputStore);
    if (myArray?.index === 0) {
      var myRe2 = /^=SUM\((\w)(\d):(\w)(\d)\)/g;
      var myArray2 = myRe2.exec($inputStore);
      console.log("777 2",myArray2)
    }
    console.log("777 1",myArray)
  });

  const onLoad = async () => {
    console.log($sCoords.select[0])
    cell.focus();
    cell.addEventListener(`selectionchange`, () => {
      selection = document.getSelection();
    });
    console.log("777 mode", mode)
    // let text = $inputStore.replace(/<[^>]+>/g, '');
    // console.log("999", text,text.length )
    // setCaretPosition(cell, text.length);
  }

  onMount(onLoad);
  // span.cell-content(
  //     style:font-weight='{$stateTableStyles.getElement($stateCoordinates.select[0][1]-1, $stateCoordinates.select[0][0]).fontWeight}'
  //   )
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
  )
    slot
</template>

<style lang="scss">
  @import "./cellEdit.scss";
</style>
