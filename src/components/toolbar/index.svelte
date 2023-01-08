<script lang="ts">
  import Button from "../ui/i-button/index.svelte";
  import {importCSV} from "./importCSV.ts";
  import { stateTableMatrix,  stateCoordinates as sCoords, inputStore } from "../../lib/data/stores";
  import { stateTableMeta } from "../../lib/data/stores";
  import {createEventbusDispatcher} from '../../lib/eventBus';

  let files;
  let fetchStatus = 'INITIAL';
  const dispatch = createEventbusDispatcher();

  const handleImportCSV = () => {
      console.log("CLICK");
      if (files) {
        fetchStatus = 'PENDING';
        try {
          importCSV(files);
          fetchStatus = 'FULFILLED';
        } catch {
          fetchStatus = 'REJECTED'
        }
      }
  }

  function handleFunctions(e) {
    let coordsName = sCoords.collRangeName();
    let coords = sCoords.collRange();
    console.log("777 ",$sCoords);
    console.dir($sCoords.functionCell);

    // if (coords[0][0] != coords[1][0] || coords[0][1] != coords[1][1]) {
      //check cell coords[0][0] coords[1][1]+1

      $sCoords.editCell = {
        height: $sCoords.functionCell.offsetHeight,
        width: $sCoords.functionCell.offsetWidth,
        top: $sCoords.functionCell.offsetTop,
        left: $sCoords.functionCell.offsetLeft,
      }
      $sCoords.selectSpace = {
        height: $sCoords.functionCell.offsetHeight,
        width: $sCoords.functionCell.offsetWidth,
        top: $sCoords.functionCell.offsetTop,
        left: $sCoords.functionCell.offsetLeft,
      }

      $sCoords.editCellCols = [+$sCoords.functionCell.dataset.column, +$sCoords.functionCell.dataset.row + 1]

      $sCoords=$sCoords
    // }
    console.log("777 2",$sCoords);

    dispatch('showEditCell', true);

    console.log("999", $sCoords.selectCell);

    $inputStore = `=SUM(${coordsName[0][0]}${coordsName[0][1]}:${coordsName[1][0]}${coordsName[1][1]})`;
  }

  function handleBold(e) {
    const   text = window.getSelection()!.toString();
    console.log("999", text)
    console.log(e);
    console.log("999",$stateTableMeta.print())

    let obj = $stateTableMeta.getElement(
          $sCoords.select[0][0],
          $sCoords.select[0][1]-1);

    if (!obj.styles) {
      obj.styles = {};
    }

    obj.styles.fontWeight = obj.styles.fontWeight !== "bold" ? "bold" : "normal";
    $stateTableMeta.setElement(
      $sCoords.select[0][0],
      $sCoords.select[0][1]-1,
      obj
    );
    $stateTableMeta = $stateTableMeta;

    console.log("999",$stateTableMeta.getElement(
          $sCoords.select[0][0],
          $sCoords.select[0][1]-1));
  }

</script>

<!--language=Pug-->
<template lang="pug">
  div.toolbar
    Button.button undo
    Button.button redo
    Button.button format_align_left
    Button.button format_align_center
    Button.button format_align_right
    Button.button(
      click='{handleBold}'
    ) format_bold
    Button.button format_italic
    Button.button format_underline
    Button.button(
      click='{handleFunctions}'
    ) functions
    Button.button(click="{handleImportCSV}") upload_file
    input(type="file" bind:files)
</template>
<style lang="scss" module>
  @import "../../layout/styles/variables.scss";
  @import "./toolbar.scss";
</style>