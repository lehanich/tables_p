<script lang="ts">
  import { onMount, setContext, afterUpdate, tick } from 'svelte';
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
  import { stateTableMatrix,  stateCoordinates, inputStore } from "../../lib/data/stores"; //stateTable as state,
  import { stateTableStyles } from "../../lib/data/stores";

  let showEdit
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

  function handleNullDelta(event) {
    deltaCoordinates = [0,0];
  }

  function handleNewCoords(event) {
    console.log("777 11", event.detail.cols)
    console.log("777 11", event.detail.coords)
    console.log("777 11 -- selCoordinates deltaCols",$stateCoordinates.select, event.detail.cols)

    // deltaCoordinates   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    deltaCoordinates[0] += event.detail.coords[0];
    deltaCoordinates[1] += event.detail.coords[1];

    stateCoordinates.addDeltaCoordinates(event.detail.coords);

    console.log("777 stateCoordinates start", $stateCoordinates)
    console.log("777 deltaCoordinates --",deltaCoordinates)
    console.dir($stateTableMatrix)

    let bufferCoords = $stateTableMatrix.areaModify($stateCoordinates.select, [0,0]);//deltaCols2

    console.log("777 get coords ",bufferCoords)

    let buffer = $stateTableMatrix.getMatrix(bufferCoords);

    console.log("777 33 --",buffer.print());

    bufferCoords = $stateTableMatrix.areaModify($stateCoordinates.select, event.detail.cols);

    console.log("777 push coords ",bufferCoords)
    console.log("777 push delta ",event.detail.cols)

    $stateTableMatrix.updateMatrix(bufferCoords, buffer)

    console.log("777 stateCoordinates end", $stateCoordinates)

	}

  function handleUpdateSpace(event) {
    $stateCoordinates.selectSpace = {...event.detail.selectSpace }
    $stateCoordinates.selectCell = {...event.detail.selCell }
    // cellEditStyle =  {...event.detail.selCell }
    console.dir($stateCoordinates.selectSpace)
  }

  function handleSelectCell(event) {
    console.log("select")
    // showEdit =  CellEdit//null;
    console.dir(event.detail)
    console.log("888 stateCoordinates start", $stateCoordinates)

    // update coordinates
    $stateCoordinates.select = [...event.detail.select];
    $stateCoordinates.selectName = [
      [cols[event.detail.select[0][0]],event.detail.select[0][1]],
      [cols[event.detail.select[1][0]],event.detail.select[1][1]]
    ];

    $inputStore = $stateTableMatrix.getElement($stateCoordinates.select[0][0], $stateCoordinates.select[0][1]-1)
    
    console.log($stateTableMatrix.print());
    console.log("888 stateCoordinates end", $stateCoordinates)
    console.log($stateCoordinates.selectCell)
  }

  function handleDoubleClick(e) {
    console.log(e)
    console.log("select2")
    $stateCoordinates.selectCell = {
      height: e.target.offsetHeight,
      width: e.target.offsetWidth,
      top: $stateCoordinates.selectCell.top,
      left: $stateCoordinates.selectCell.left,
    }

    showEdit = CellEdit
  }

  function handleClickOutsideCellEdit() {
    showEdit = null
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

  afterUpdate(() => {

    console.log("666 borderCover selCoordinates ",$stateCoordinates.borderCover,$stateCoordinates.select)
    // console.log(matrix.print())
    
    console.log("666 stateCoordinates start 777 ", $stateCoordinates)

    $stateCoordinates.selectName[0] = [cols[$stateCoordinates.select[0][0]],$stateCoordinates.select[0][1]];
    $stateCoordinates.selectName[1] = [cols[$stateCoordinates.select[1][0]],$stateCoordinates.select[1][1]];

    console.log($stateCoordinates)
    console.log($inputStore)

    console.log("666 $stateCoordinates.select ", $stateCoordinates.select)

    console.log("666 stateCoordinates end", $stateCoordinates)
    console.log($stateTableMatrix.print())
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
                style:font-weight='{$stateTableStyles.getElement(index2,index1).fontWeight}'
              ) {@html $stateTableMatrix.getElement(index2,index1)}
      Selection(
        bind:select='{$stateCoordinates.select}'
        bind:selectSpace='{$stateCoordinates.selectSpace}'
        bind:borderCover='{$stateCoordinates.borderCover}'
        bind:selectCellCoords='{$stateCoordinates.selectCell}'
        deltaCols="{deltaCoordinates}"
        on:nullDelta='{handleNullDelta}'
      )
      div.test(
        style=`position: absolute; top: {$stateCoordinates.selectCell.top}px;
              left: {$stateCoordinates.selectCell.left}px;
              width: {$stateCoordinates.selectCell.width}px;
              height: {$stateCoordinates.selectCell.height}px;`
        use:clickOutside
        on:click_outside='{handleClickOutsideCellEdit}'
      )
        svelte:component(
          this='{showEdit}'
        )
    SelectionMoveView(
      borderCover='{$stateCoordinates.borderCover}'
      selectCover='{$stateCoordinates.selectSpace}'
      on:newSelectCoords='{handleNewCoords}'
    )
</template>

<style lang="scss" module>
  @import "./table.scss";
</style>
