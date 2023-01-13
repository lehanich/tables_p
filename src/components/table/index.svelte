<script lang="ts">
  import { onMount, setContext, afterUpdate, beforeUpdate, tick } from 'svelte';
  import Eventbus from '../base/EventBus.svelte';
  import Row from "./row.svelte";
  import Column from "./column.svelte";
  import Cell from "./cell.svelte";
  import CellEdit from "../cellEdit/index.svelte";
  import Selection from "../selection/index.svelte";
  import SelectionMoveView from "../selection/moveSelection.svelte";
  import {repeat, filter, seq, once, any, on,
          every, every2, onlyEvent, onlyEvents } from "../../lib/eventIter";
  import {clickOutside } from "../../lib/clickOutside";
  import { stateTableMatrix,
    stateTable,
    stateTableMeta,
    stateCoordinates as sCoords,
    inputStore } from "../../lib/data/stores"; //stateTable as state,
  import Matrix from "../../lib/data/base/Matrix/Matrix";
  import FormulaStart from "../../lib/formula/FormulaStart";
  import {createEventbusDispatcher} from "../../lib/eventBus";

  import {shortcut} from "../../lib/shortcut";

  const dispatch = createEventbusDispatcher();
  let showEdit ;//= generator.next();
  let selectSpace: AsyncGenerator; //<HTMLElementEventMap>;
  let table: DOMPoint;
  let deltaCoordinates: [number, number] = [0, 0];

  export let showEditFormula
  export const cells = [];

  setContext("show", {
    getSelect: () => selectSpace,
    getCells: () => cells,
    getTable: () => table,
    getSelectArea: () => selectSpace,
    // setCoordinates: (x,y) => updateSelCoordinates
  })

  $: showEditCell = showEdit || (showEditFormula ? CellEdit : null);
  $: cellEditMode = showEdit ? "text" : (showEditFormula ? "formula" : "text");
  $: metaData = $stateTableMeta.array;

  function shandleShortcut(e) {
    console.log("copy", e)
    
  }

  const copyContent = async () => {
    try {
      let bufferCoords = $stateTableMatrix.areaModify($sCoords.select, [0,0]);
      let buffer = $stateTableMatrix.getMatrixString(bufferCoords, "\t");

      await navigator.clipboard.writeText(buffer);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  const readContent = async () => {
    console.log("readContent");
    try {
      let t = await navigator.clipboard.readText();
      let a = t.split("\n");
      let l = a[0].split("\t");
      let pasteMatrix = new Matrix(l.length, a.length, "");
      for(let i=0; i< a.length; i++) {
        let colls = a[i].split("\t");

        for(let j=0; j< colls.length; j++) {
          pasteMatrix.setElement(j,i,colls[j]);
        }
      }

      $stateTableMatrix.updateMatrixFromCursor($sCoords.select[0], pasteMatrix);
      stateTableMatrix.update($stateTableMatrix => $stateTableMatrix) ;
      $inputStore = <string>pasteMatrix.getElement(0,0);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  let shortcutObj = [
    {control: true, code: 'KeyC', callback: copyContent},
    {control: true, code: 'KeyV', callback: readContent}
  ];

  function copySuccess(e) {
    console.log("copy", e)
  }

  function copyError(e) {
    console.log("copy", e)
  }

  function handleNullDelta(event) {
    deltaCoordinates = [0,0];
  }

  function handleNewCoords(event) {
    $sCoords.editCellCols[0] +=  event.detail.cols[0];
    $sCoords.editCellCols[1] +=  event.detail.cols[1];
    // deltaCoordinates
    deltaCoordinates[0] += event.detail.coords[0];
    deltaCoordinates[1] += event.detail.coords[1];

    let undoCoordinates = [
      [$sCoords.select[0][0],$sCoords.select[0][1]],
      [$sCoords.select[1][0],$sCoords.select[1][1]]
    ];

    sCoords.addDeltaCoordinates(event.detail.coords);

    let bufferReadCoords = $stateTableMatrix.areaModify($sCoords.select, [0,0]);//deltaCols2
    let buffer = $stateTableMatrix.getMatrix(bufferReadCoords);
    let bufferMeta = $stateTableMeta.getMatrix(bufferReadCoords);
    let bufferWriteCoords = $stateTableMatrix.areaModify($sCoords.select, event.detail.cols);
    let bufferBackup = $stateTableMatrix.readMatrix(bufferWriteCoords);
    let bufferBackupMeta = $stateTableMeta.readMatrix(bufferWriteCoords);

    $stateTableMatrix.updateMatrix(bufferWriteCoords, buffer);
    $stateTableMeta.updateMatrix(bufferWriteCoords, bufferMeta);

    // stateTableMeta.update($stateTableMeta => $stateTableMeta)
    $stateTableMeta = $stateTableMeta

    sCoords.addDeltaCols(event.detail.cols);

    dispatch('setHistory', {
      type: "moveArea",
      parameter: "",
      valueRedo: {

        buffer,
        bufferMeta,
        coordinates: undoCoordinates,
        coordinate: [event.detail.cols[0], event.detail.cols[1]],
      },
      valueUndo: {
        buffer,
        bufferMeta,
        bufferBackup,
        bufferBackupMeta,
        coordinates: [
          [$sCoords.select[0][0],$sCoords.select[0][1]],
          [$sCoords.select[1][0],$sCoords.select[1][1]]
        ],
        coordinate: [-1 * event.detail.cols[0], -1 * event.detail.cols[1]],
      },
      coordinate: [event.detail.cols[0], event.detail.cols[1]],
      coordinates: undoCoordinates
    });

	}

  function handleUpdateSpace(event) {
    $sCoords.selectSpace = {...event.detail.selectSpace }
    $sCoords.selectCell = {...event.detail.selCell }

    console.dir($sCoords.selectSpace);
  }

  function handleSelectCell(event) {
    // update coordinates
    $sCoords.select = [...event.detail.select];
    $sCoords.selectName = [
      [$stateTable.cols[event.detail.select[0][0]],event.detail.select[0][1]],
      [$stateTable.cols[event.detail.select[1][0]],event.detail.select[1][1]]
    ];
    $sCoords.editCellCols = [...event.detail.select[0]];

    let meta = $stateTableMeta.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1);

    $inputStore = meta &&
      meta.formula ?
      meta.formula :
      $stateTableMatrix.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1);
      console.log("formula table data",$stateTableMatrix.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1))
  }

  function handleDoubleClick(e) {
    console.log("double click", e, +$sCoords.functionCell.dataset.column, +$sCoords.functionCell.dataset.row + 1);

    const width = $stateTableMeta.getElement(+$sCoords.functionCell.dataset.column, +$sCoords.functionCell.dataset.row + 1).styles?.width;
    const height = $stateTableMeta.getElement(+$sCoords.functionCell.dataset.column, +$sCoords.functionCell.dataset.row + 1).styles?.height;

    $sCoords.editCell = { //selectCell = {
      height: height ? +height.replace("px","") : 24, //e.target.offsetHeight, HARDCODE !!!
      width: width ? +width.replace("px","") : 120, //e.target.offsetWidth, HARDCODE !!!
      top: $sCoords.selectCell.top,
      left: $sCoords.selectCell.left,
    }
    console.log("double click editcell", $sCoords.editCell);

    $sCoords.editCellCols = [+$sCoords.functionCell.dataset.column, +$sCoords.functionCell.dataset.row + 1];
    $sCoords = $sCoords;
    showEdit = CellEdit
  }

  function unpdateFormulasResults() {
    let index = 0;

    for(let meta of $stateTableMeta.print()) {
      if (meta && meta.formula) {
        $stateTableMatrix
          .updateById(index, FormulaStart(meta.formula, $stateTableMatrix, null))
      }
      index++;
    }
    $stateTableMatrix = $stateTableMatrix
  }

  function handleClickOutsideCellEdit() {
    showEdit = null;
    showEditFormula = false;
    $sCoords.editCell = { //selectCell = {
      ...$sCoords.editCell,
      top: -100,
      left: -100,
    }
    unpdateFormulasResults();
  }

  afterUpdate(() => {
    console.log("table meta ", $stateTableMeta.print());
    console.log("table data ", $stateTableMatrix.print());

    $sCoords.selectName[0] = [$stateTable.cols[$sCoords.select[0][0]],$sCoords.select[0][1]];
    $sCoords.selectName[1] = [$stateTable.cols[$sCoords.select[1][0]],$sCoords.select[1][1]];

    let coords = sCoords.collRange();

    console.log("coords",coords)
    if (coords[0][1] > 0 && coords[1][1] > 0) {
      if ((coords[0][0] != coords[1][0] || coords[0][1] != coords[1][1])) {
        $sCoords.functionCell = cells[coords[1][1]][coords[0][0]];
      } else { 
        $sCoords.functionCell = cells[coords[1][1]-1][coords[0][0]];
      }
    }
  })

  for(let i=0; i< 21; i++) {
    cells.push([]);
  }

  const onLoad = async () => {
    await tick()
    console.log(4,cells)
    console.log(cells[1][1])

    selectSpace =
      repeat(() =>
        filter(
          seq(
            once(table, 'mousedown'),
            every(
              any(
                on(table, 'mousemove'),
                 on(table, 'mouseup')
              ),
              onlyEvent('mousemove')
            )
          ),
          onlyEvents('mousedown','mousemove')//, 'mouseup')
        )
      );
  }

  onMount(onLoad);
</script>

<!--language=Pug-->
<template lang="pug">
  Eventbus(
    on:nullDelta='{handleNullDelta}'
    on:updateSpace='{handleUpdateSpace}'

    on:selectCell='{handleSelectCell}'
    on:dblclick='{handleDoubleClick}'
  )
    div.table(
      bind:this='{table}'
      on:dblclick='{handleDoubleClick}'
      use:shortcut='{shortcutObj}'
      on:click='{shandleShortcut}'
    )
      Row(index="{null}")
        +each('$stateTable.cols as col, index (1000 + index)')
          Column(bind:cell='{cells[0][index]}') {col}
      +each('$stateTable.rows as row, index1 (3000 + index1)')
        Row(index="{index1}")
          +each('$stateTable.cols as col, index2 (4000 + index2)')
            Cell(
              row="{index1}"
              column="{index2}"
              bind:cell='{cells[index1][index2]}'
              width='{$stateTableMeta.getElement(index2,index1).styles?.width}'
              height='{$stateTableMeta.getElement(index2,index1).styles?.height}'
              display='{$stateTableMeta.getElement(index2,index1).styles?.display}'
            )
              span.cell-content(
                style="display: inline-block; width: 100%;"
                style:font-weight='{$stateTableMeta.getElement(index2,index1).styles?.fontWeight}'
                style:font-style='{$stateTableMeta.getElement(index2,index1).styles?.fontStyle}'
                style:text-decoration='{$stateTableMeta.getElement(index2,index1).styles?.textDecoration}'
                style:text-align='{$stateTableMeta.getElement(index2,index1).styles?.textAlign}'
              ) {@html $stateTableMatrix.getElement(index2,index1)}
      Selection(
        bind:select='{$sCoords.select}'
        bind:selectSpace='{$sCoords.selectSpace}'
        bind:borderCover='{$sCoords.borderCover}'
        bind:selectCellCoords='{$sCoords.selectCell}'
        deltaCols="{deltaCoordinates}"
        on:nullDelta='{handleNullDelta}'
      )
      div.cellEdit(
        style=`position: absolute; top: {$sCoords.editCell.top}px;
              left: {$sCoords.editCell.left}px;
              width: {$sCoords.editCell.width}px;
              height: {$sCoords.editCell.height}px;
              z-index: 2;
              cursor: text;`
        use:clickOutside
        on:click_outside='{handleClickOutsideCellEdit}'
      )
        svelte:component(
          this='{showEditCell}'
          mode='{cellEditMode}'
        )
    SelectionMoveView(
      borderCover='{$sCoords.borderCover}'
      selectCover='{$sCoords.selectSpace}'
      on:newSelectCoords='{handleNewCoords}'
    )
</template>

<style lang="scss" module>
  @import "./table.scss";
</style>
