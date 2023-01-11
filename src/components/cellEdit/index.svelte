<!-- <svelte:options accessors immutable/> -->

<script lang="ts">
  import { afterUpdate, beforeUpdate, onMount } from 'svelte';
  import { stateTableMatrix, stateTableMeta, inputStore, stateCoordinates as sCoords } from "../../lib/data/stores";
  // import { setCaretPosition } from "../../lib/helpers";

  import FormulaParser, {ParserMathCols} from "../../lib/formula/FormulaParser";

  export let cell: HTMLDivElement;
  export let html: string = "";

  const { value, row, column, mode } = $$props
  let selection;

  function handleKeydown(e) {
    console.log("history key",e);
    // console.log('history currentColor:', $inputStore, 'prevColor:', historyOldVal);
  }

  function handleSelect(e) {
    console.log("999", e);
  }

  // beforeUpdate(() => {
  //   console.log("777 ce bb  meta -2", $stateTableMeta.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]-2));
  //   console.log("777 ce bb meta -1", $stateTableMeta.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1));
  //   console.log("777 ce bb meta 0", $stateTableMeta.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]));

  // })

  afterUpdate(() => {
    // html = html ?? value;
    // console.log("999 $sCoords", $sCoords.editCellCols)
    // $stateTableMatrix
    //   .update($sCoords.select[0][0], $sCoords.select[0][1]-1)
    //   .element = $inputStore;

    // $stateTableMatrix
    //   .update($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1)
    //   .element = $inputStore;

    // $stateTableMatrix = $stateTableMatrix

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

    console.log("777 ce b meta -2", $stateTableMeta.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]-2));
    console.log("777 ce b meta -1", $stateTableMeta.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1));
    console.log("777 ce b meta 0", $stateTableMeta.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]));

    // var myRe = /^=/g;
    // var myArray = myRe.exec($inputStore);
    // if (myArray?.index === 0) {
    //   var myRe2 = /^=SUM\((\w)(\d):(\w)(\d)\)/g;
    //   var myArray2 = myRe2.exec($inputStore);
    //   console.log("777 2",myArray2)

    //   console.log("777 $sCoords.editCellCols", $sCoords.editCellCols)
    //   let meta =  $stateTableMeta
    //     .getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1);
    //   if (!meta) {meta = {}; }

    //   meta.formula =  $inputStore;
    //   console.log("777 set meta celledit", $sCoords.editCellCols[1]-1)
    //   // $stateTableMeta
    //   //   .update($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1)
    //   //   .element = meta;

    //   $stateTableMeta = $stateTableMeta;

    //   let test = new FormulaParser(new ParserMathCols($inputStore, $stateTableMatrix, ()=>{}));
    //   $stateTableMatrix
    //     .update($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1)
    //     .element = "5"; //test.exec();
    //   console.log("777 $sCoords.editCellCols 2 ", $sCoords.editCellCols)
    //   $stateTableMatrix = $stateTableMatrix;
    // } else {
    //   $stateTableMatrix
    //   .update($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1)
    //   .element = $inputStore;

    //   $stateTableMatrix = $stateTableMatrix;
    // }
    
    console.log("777 ce a meta -2", $stateTableMeta.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]-2));
    console.log("777 ce a meta -1", $stateTableMeta.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1));
    console.log("777 ce a meta 0", $stateTableMeta.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]));


    // console.log("777 1",myArray)
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
    on:keydown='{handleKeydown}'
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
