<script lang="ts">
  import { onMount, setContext, afterUpdate, beforeUpdate, tick } from 'svelte';
  // import {data as state } from "../toolbar/importCSV";
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
  // import {data} from "../toolbar/importCSV";
  import { stateTableMatrix,  stateCoordinates as sCoords, inputStore } from "../../lib/data/stores"; //stateTable as state,
  import { stateTableMeta } from "../../lib/data/stores";
	// import { beforeUpdate } from 'svelte/types/runtime/internal/lifecycle';

  // let generator = showEditCell2(true);
  let showEdit ;//= generator.next();

  export let showEditFormula
  let selectSpace: AsyncGenerator; //<HTMLElementEventMap>;
  let table: DOMPoint;
  let deltaCoordinates: [number, number] = [0, 0];

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
  function handleNullDelta(event) {
    deltaCoordinates = [0,0];
  }

  function handleNewCoords(event) {
    console.log("777 11", event.detail.cols)
    console.log("777 11", event.detail.coords)
    console.log("777 11 -- selCoordinates deltaCols",$sCoords.select, event.detail.cols)

    $sCoords.editCellCols[0] +=  event.detail.coords[0];
    $sCoords.editCellCols[1] +=  event.detail.coords[1];
    // deltaCoordinates   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    deltaCoordinates[0] += event.detail.coords[0];
    deltaCoordinates[1] += event.detail.coords[1];

    sCoords.addDeltaCoordinates(event.detail.coords);

    console.log("777 stateCoordinates start", $sCoords)
    console.log("777 deltaCoordinates --",deltaCoordinates)
    console.dir($stateTableMatrix)

    let bufferCoords = $stateTableMatrix.areaModify($sCoords.select, [0,0]);//deltaCols2

    console.log("777 get coords ",bufferCoords)

    let buffer = $stateTableMatrix.getMatrix(bufferCoords);

    console.log("777 33 --",buffer.print());

    bufferCoords = $stateTableMatrix.areaModify($sCoords.select, event.detail.cols);

    console.log("777 push coords ",bufferCoords)
    console.log("777 push delta ",event.detail.cols)

    $stateTableMatrix.updateMatrix(bufferCoords, buffer)

    console.log("777 stateCoordinates end", $sCoords)

	}

  function handleUpdateSpace(event) {
    $sCoords.selectSpace = {...event.detail.selectSpace }
    $sCoords.selectCell = {...event.detail.selCell }
    // cellEditStyle =  {...event.detail.selCell }
    console.dir($sCoords.selectSpace)
  }

  function handleSelectCell(event) {
    console.log("select")
    // showEdit =  CellEdit//null;
    console.dir(event.detail)
    console.log("999 stateCoordinates start", $sCoords)

    // update coordinates
    $sCoords.select = [...event.detail.select];
    $sCoords.selectName = [
      [cols[event.detail.select[0][0]],event.detail.select[0][1]],
      [cols[event.detail.select[1][0]],event.detail.select[1][1]]
    ];
    $sCoords.editCellCols = [...event.detail.select[0]];

    // $inputStore = $stateTableMatrix.getElement($sCoords.select[0][0], $sCoords.select[0][1]-1);
    // console.log("999 3 1",$stateTableMatrix.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1))
    // console.log("999 3 2",$stateTableMatrix.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]))
    // console.log("999 3 3",$stateTableMatrix.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]+1))

    $inputStore = $stateTableMatrix.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1]-1)
    
    console.log($stateTableMatrix.print());
    console.log("999 stateCoordinates end", $sCoords)
    console.log($sCoords.selectCell)
  }

  function handleDoubleClick(e) {
    // console.log(e)
    // console.log("7779 ",$sCoords);
    // console.log("7779 $sCoords.functionCell.dataset ",$sCoords.functionCell.dataset);
    $sCoords.editCell = { //selectCell = {
      height: e.target.offsetHeight,
      width: e.target.offsetWidth,
      top: $sCoords.selectCell.top,
      left: $sCoords.selectCell.left,
    }

    $sCoords.editCellCols = [+$sCoords.functionCell.dataset.column, +$sCoords.functionCell.dataset.row + 1];
    // $inputStore = $stateTableMatrix.getElement($sCoords.editCellCols[0], $sCoords.editCellCols[1])

    showEdit = CellEdit
  }
  // function* showEditCell2(state) {
  //   // let run = true
  //   while (true) {
  //     yield state;
  //   }

  //   // return { done: true };
  // }

  function handleClickOutsideCellEdit() {
    showEdit = null;
    showEditFormula = false;
  }

  function toChar(_: any, i:number) {
    return String.fromCharCode(CODES.A + i);
  }

  const CODES = {
    A: 65,
    Z: 90,
  };
  const colsCount = CODES.Z - CODES.A + 1;
  const rows = [] //new Array(20+1);
  for(let i=0; i< 21; i++) { rows.push("")}

  const cols = [] //new Array(colsCount).fill('').map(toChar); //.map(toColumn).join('');
  for(let i=0; i< colsCount; i++) { cols.push(toChar(cols,i))}
  console.log(cols)

  // let headerTable = [];

  beforeUpdate(() => {
    // console.log("777 show edit showEdit", showEdit)
    // console.log("777 show edit showEditCell", showEditCell)
    // console.log("777 show edit showEditFormula", showEditFormula)

  })

  afterUpdate(() => {
    console.log("777 show edit showEdit", showEdit)
    // console.log("777 show edit showEditCell", showEditCell)
    // console.log("777 show edit showEditFormula", showEditFormula)

    console.log("666 borderCover selCoordinates ",$sCoords.editCellCols,$sCoords.select)
    // console.log(matrix.print())
    
    // console.log("666 stateCoordinates start 777 ", $sCoords)

    $sCoords.selectName[0] = [cols[$sCoords.select[0][0]],$sCoords.select[0][1]];
    $sCoords.selectName[1] = [cols[$sCoords.select[1][0]],$sCoords.select[1][1]];

    let coords = sCoords.collRange();
    // console.dir(coords)
    // console.log($sCoords)
    if (coords[0][0] != coords[1][0] || coords[0][1] != coords[1][1]) {
      $sCoords.functionCell = cells[coords[1][1]][coords[0][0]];
    } else { 
      $sCoords.functionCell = cells[coords[1][1]-1][coords[0][0]];
    }

    // console.log("777 show edit", showEdit)
    // console.log("777 sCoords cell",$sCoords.selectCell)
    // console.log("777 $sCoords.functionCell", $sCoords.functionCell.offsetTop, $sCoords.functionCell.offsetLeft, $sCoords.functionCell.dataset)
    console.dir($sCoords.functionCell)
    console.log($inputStore)

    // console.log("666 cellEditMode", cellEditMode)
    // console.log("666 $sCoords.select ", $sCoords.select)

    // console.log("666 stateCoordinates end", $sCoords)
    // console.log("7779 ",$stateTableMatrix.print())
  })

  // if ($state[0]) {
  //   headerTable = Object.keys($state[0]);
  // }

  // export const cells = [] //new Array(20+1).fill(new Array(colsCount)); //"A".charCodeAt(0)
  for(let i=0; i< 21; i++) {
    cells.push([]);
    // cells[i].push([]);
    // for(let j=0; j< colsCount; j++) {
    //   cells[i][j] = "";
    // }
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
  //- span.cell-span(
              //-   style='{$stateTableStyles.getElement(index2,index1)}'
              //- ){@html $stateTableMatrix.getElement(index2,index1)}
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
    )
      Row
        +each('cols as col, index (1000 + index)')
          Column(bind:cell='{cells[0][index]}') {col}
      +each('rows as row, index1 (3000 + index1)')
        Row(index="{index1}")
          +each('cols as col, index2 (4000 + index2)')
            Cell(
              row="{index1}"
              column="{index2}"
              bind:cell='{cells[index1][index2]}'
            )
              span.cell-content(
                style:font-weight='{$stateTableMeta.getElement(index2,index1).styles?.fontWeight}'
              ) {@html $stateTableMatrix.getElement(index2,index1)}
      Selection(
        bind:select='{$sCoords.select}'
        bind:selectSpace='{$sCoords.selectSpace}'
        bind:borderCover='{$sCoords.borderCover}'
        bind:selectCellCoords='{$sCoords.selectCell}'
        deltaCols="{deltaCoordinates}"
        on:nullDelta='{handleNullDelta}'
      )
      div.test(
        style=`position: absolute; top: {$sCoords.editCell.top}px;
              left: {$sCoords.editCell.left}px;
              width: {$sCoords.editCell.width}px;
              height: {$sCoords.editCell.height}px;`
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
