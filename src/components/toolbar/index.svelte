<script lang="ts">
  import Button from "../ui/i-button/index.svelte";
  import {importCSV} from "./importCSV";
  import { stateTableMatrix,
    stateTableMeta,
    stateTable,
    stateCoordinates as sCoords,
    inputStore,
    stateHistory } from "../../lib/data/stores";
  import {createEventbusDispatcher} from '../../lib/eventBus';
  // import FormulaStart from "../../lib/formula/FormulaStart";

  let files;
  let fileInput;
  let formula;
  let fetchStatus = 'INITIAL';
  let historyOldVal;

  const dispatch = createEventbusDispatcher();
  const will = (f, v) => () => f(v);
  const handleHistory = (mode) => {
    dispatch('readHistory', mode);
  }

  const handleUnion = () => {
    console.log("table union")
    // let bufferCoords = $stateTableMatrix.areaModify($sCoords.select, [0,0]);
    // let buffer = $stateTableMatrix.getMatrixString(bufferCoords, "\t");
    // console.log("table ",$stateTable.cells.print())
    stateTableMeta.unionCols($sCoords.select);
    $stateTableMeta = $stateTableMeta;
    // $stateTable.cells.unionElements($sCoords.select)
    console.log("table", $stateTableMeta.print());
  }

  const handleSeparate = () => {
    stateTableMeta.separateCols($sCoords.select);
    $stateTableMeta = $stateTableMeta;
    // $stateTable.cells.separateElements($sCoords.select)
    console.log("table", $stateTableMeta.print());
  }

  const download = (filename) => {
    let text = $stateTableMatrix.getMatrixString([[0,1],[$stateTableMatrix.width,$stateTableMatrix.height]], ";")
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  const fileInputClick = () => {
    fileInput.value = null;
    fileInput.click()
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
    
    let historyOldVal = $stateTableMatrix.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]);
    let historyOldValMeta = $stateTableMeta.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]);

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

    dispatch('setHistory', {
        type: "click_formula",
        parameter: historyOldValMeta ? "click_meta" : "click_data",
        valueRedo: {
          data: "",
          formula
        },
        valueUndo: {
          data: historyOldVal,
          formula: historyOldValMeta.formula
        },
        coordinate: [$sCoords.editCellCols[0], $sCoords.editCellCols[1]],
        coordinates: [
          [$sCoords.select[0][0],$sCoords.select[0][1]],
          [$sCoords.select[1][0],$sCoords.select[1][1]]
        ] //selectFormulaSpace
    });
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
    Button.button(
      click='{will(fileInputClick,\'\')}'
    ) upload_file
    Button.button(
      click='{will(download,\'export.csv\')}'
    ) download
    //- Button.button(
    //-   click='{will(handleUnion,\'\')}'
    //- ) add
    //- Button.button(
    //-   click='{will(handleSeparate,\'\')}'
    //- ) cancel
    div
      input(
        type="file"
        bind:files
        bind:this='{fileInput}'
        on:change='{will(handleImportCSV,\'\')}'
        style='display:none;'
      )
</template>

<style lang="scss" module>
  @import "../../layout/styles/variables.scss";
  @import "./toolbar.scss";
</style>
