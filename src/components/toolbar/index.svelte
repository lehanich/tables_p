<script lang="ts">
  import Button from "../ui/i-button/index.svelte";
  import {importCSV} from "./importCSV";
  import { stateTableMatrix,
    stateTableMeta,
    stateCoordinates as sCoords,
    inputStore,
    stateHistory } from "../../lib/data/stores";
  import {createEventbusDispatcher} from '../../lib/eventBus';
  import FormulaParser, {ParserMathCols} from "../../lib/formula/FormulaParser";

  let files;
  let formula;
  let fetchStatus = 'INITIAL';
  let historyOldVal;

  const dispatch = createEventbusDispatcher();
  const will = (f, v) => () => f(v);
  const handleHistory = (mode) => {
    dispatch('readHistory', mode);
  }

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

    dispatch('showEditCell', true);

    formula = `=SUM(${coordsName[0][0]}${coordsName[0][1]}:${coordsName[1][0]}${coordsName[1][1]})`;

    // let row = +$sCoords.functionCell.dataset.row + 1;

    $inputStore = formula;
  }

  function handleBold(e) {
    const text = window.getSelection()!.toString();
    let obj = $stateTableMeta.getElement(
          $sCoords.select[0][0],
          $sCoords.select[0][1]-1);

    if (!obj.styles) {
      obj.styles = {};
    }

    historyOldVal = obj.styles.fontWeight
    obj.styles.fontWeight = obj.styles.fontWeight !== "bold" ? "bold" : "normal";

    $stateTableMeta = $stateTableMeta;

    dispatch('setHistory', {
      type: "style",
      parameter: "fontWeight",
      valueRedo: obj.styles.fontWeight,
      valueUndo: historyOldVal ? historyOldVal : obj.styles.fontWeight !== "bold" ? "bold" : "normal",
      coordinate: [$sCoords.select[0][0], $sCoords.select[0][1]],
      coordinates: [
        [$sCoords.select[0][0],$sCoords.select[0][1]],
        [$sCoords.select[1][0],$sCoords.select[1][1]]
      ]
    });
  }

  function handleItalic(e) {
    const text = window.getSelection()!.toString();

    let obj = $stateTableMeta.getElement(
          $sCoords.select[0][0],
          $sCoords.select[0][1]-1);

    if (!obj.styles) {
      obj.styles = {};
    }

    historyOldVal = obj.styles.fontStyle;
    obj.styles.fontStyle = obj.styles.fontStyle !== "italic" ? "italic" : "normal";
    $stateTableMeta = $stateTableMeta;

    dispatch('setHistory', {
      type: "style",
      parameter: "fontStyle",
      valueRedo: obj.styles.fontStyle,
      valueUndo: historyOldVal ? historyOldVal : obj.styles.fontStyle !== "italic" ? "italic" : "normal",
      coordinate: [$sCoords.select[0][0], $sCoords.select[0][1]],
      coordinates: [
        [$sCoords.select[0][0],$sCoords.select[0][1]],
        [$sCoords.select[1][0],$sCoords.select[1][1]]
      ]
    });
  }

  function handleTextDecoration(value: string) {
    const   text = window.getSelection()!.toString();

    let obj = $stateTableMeta.getElement(
          $sCoords.select[0][0],
          $sCoords.select[0][1]-1);

    if (!obj.styles) {
      obj.styles = {};
    }

    historyOldVal = obj.styles.textDecoration;
    obj.styles.textDecoration = obj.styles.textDecoration === value ? "none" : value;
    $stateTableMeta = $stateTableMeta;

    dispatch('setHistory', {
      type: "style",
      parameter: "textDecoration",
      valueRedo: obj.styles.textDecoration,
      valueUndo: historyOldVal ? historyOldVal : obj.styles.textDecoration === value ? "none" : value,
      coordinate: [$sCoords.select[0][0], $sCoords.select[0][1]],
      coordinates: [
        [$sCoords.select[0][0],$sCoords.select[0][1]],
        [$sCoords.select[1][0],$sCoords.select[1][1]]
      ]
    });
  }

  function handleTextAlign(value: string) {
    const   text = window.getSelection()!.toString();

    let obj = $stateTableMeta.getElement(
          $sCoords.select[0][0],
          $sCoords.select[0][1]-1);

    if (!obj.styles) {
      obj.styles = {};
    }

    historyOldVal = obj.styles.textAlign;
    obj.styles.textAlign = obj.styles.textAlign === value ? "initial" : value;
    $stateTableMeta = $stateTableMeta;

    dispatch('setHistory', {
      type: "style",
      parameter: "textAlign",
      valueRedo: obj.styles.textAlign,
      valueUndo: historyOldVal ? historyOldVal : obj.styles.textAlign === value ? "initial" : value,
      coordinate: [$sCoords.select[0][0], $sCoords.select[0][1]],
      coordinates: [
        [$sCoords.select[0][0],$sCoords.select[0][1]],
        [$sCoords.select[1][0],$sCoords.select[1][1]]
      ]
    });
  }

</script>

<template lang="pug">
  div.toolbar
    Button.button(
      click='{will(handleHistory, \'undo\')}'
    ) undo
    Button.button(
      click='{will(handleHistory, \'redo\')}'
    ) redo
    Button.button(
      click='{will(handleTextAlign, \'left\')}'
    ) format_align_left
    Button.button(
      click='{will(handleTextAlign,\'center\')}'
    ) format_align_center
    Button.button(
      click='{will(handleTextAlign,\'right\')}'
    ) format_align_right
    Button.button(
      click='{handleBold}'
    ) format_bold
    Button.button(
      click='{handleItalic}'
    ) format_italic
    Button.button(
      click='{will(handleTextDecoration,\'underline\')}'
    ) format_underline
    Button.button(
      click='{will(handleTextDecoration,\'line-through\')}'
    ) format_strikethrough
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
