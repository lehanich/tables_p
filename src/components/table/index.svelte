<script lang="ts">
  import { onMount, setContext, afterUpdate, tick } from 'svelte';
  // import {data as state } from "../toolbar/importCSV";
  import Eventbus from '../base/EventBus.svelte';
  import Row from "./row.svelte";
  import Column from "./column.svelte";
  import Cell from "./cell.svelte";
  import Selection from "../selection/index.svelte";
  import SelectionMoveView from "../selection/moveSelection.svelte";
  import {repeat, filter, seq, once, any, on, every, every2, onlyEvent, onlyEvents } from "../../lib/eventIter.ts";
  // import {data} from "../toolbar/importCSV";
  import { stateTable as state } from "../../lib/data/stores";


  let selectSpace: AsyncGenerator<HTMLElementEventMap>;
  let table: DOMPoint;

  let borderCover;
  let selCoordinates

  let deltaCols: [number, number] = [0, 0];
  let deltaCoordinates: [number, number] = [0, 0];
  let deltaCols2: [number, number] = [0, 0];

  function nullDelta(event) {
    deltaCols = [0,0];
    deltaCoordinates = [0,0];
    deltaCols2 = [0,0];
    console.log("444 11 null coords",event)
  }
  function nullCoordinates2(event) {
    // deltaCols = [...event.detail.coords];

    // deltaCols[0] += event.detail.coords[0];
    // deltaCols[1] += event.detail.coords[1];

    // borderCover.left += deltaCols[0] //event.detail.coords[0]
    // borderCover.top += deltaCols[1] //event.detail.coords[1]
    console.log("444 11 null coords", event.detail.coords) //borderCover
  }

  function handleCoords(event) {
    console.log("444 11", event.detail.cols)
    console.log("444 11", event.detail.coords)
    // console.log("444 11 ++",deltaCols)
		// deltaCols = [...event.detail.coords];
    deltaCols[0] += event.detail.cols[0];
    deltaCols[1] += event.detail.cols[1];
    // borderCover.left += event.detail.coords[0]
    // borderCover.top += event.detail.coords[1]
    console.log("444 11 --",selCoordinates, deltaCols)

    deltaCoordinates
    deltaCoordinates[0] += event.detail.coords[0];
    deltaCoordinates[1] += event.detail.coords[1];
    borderCover.left += event.detail.coords[0]
    borderCover.top += event.detail.coords[1]
    console.log("444 11 --",deltaCoordinates)

    // selCoordinates
    // deltaCols

    let buffer = [];
    let index1 = 0;
    for(let i=selCoordinates[0][1] - 1 + deltaCols2[1]; i < selCoordinates[1][1] + deltaCols2[1]; i++) {
      buffer[index1] = [];
      let index2 = 0;
      for(let j = selCoordinates[0][0] + deltaCols2[0]; j <= selCoordinates[1][0] + deltaCols2[0]; j++) {
        console.log(i,j,$state[i][j])
        buffer[index1][index2] = $state[i][j];
        index2++;
        $state[i][j] = "";
      }
      index1++;
    }
    console.log("444 buffer", buffer)

    index1 = 0;
    for(let i=selCoordinates[0][1] - 1 + deltaCols[1]; i < selCoordinates[1][1] + deltaCols[1]; i++) {

      let index2 = 0;
      for(let j = selCoordinates[0][0] + deltaCols[0]; j <= selCoordinates[1][0] + deltaCols[0]; j++) {
        $state[i][j] = buffer[index1][index2];
        index2++;
      }
      index1++;
    }
    
    deltaCols2 = [...deltaCols];

	}

  setContext("show", {
    getSelect: () => selectSpace,
    getCells: () => cells,
    getTable: () => table
  })

  const CODES = {
    A: 65,
    Z: 90,
  };

  function toChar(_: any, i:number) {
    return String.fromCharCode(CODES.A + i);
  }

  const colsCount = CODES.Z - CODES.A + 1;
  const rows = [] //new Array(20+1);
  for(let i=0; i< 21; i++) { rows.push("")}

  const cols = [] //new Array(colsCount).fill('').map(toChar); //.map(toColumn).join('');
  for(let i=0; i< colsCount; i++) { cols.push(toChar(cols,i))}
  console.log(cols)
  // let state //= new Array(20+1).fill(new Array(26));// [];
  // let state = [
  //   ["John", "john@example.com", "(353) 01 222 3333"],
  //   ["Sarah", "sarah@gmail.com", "(01) 22 888 4444"],
  //   ["Afshin", "afshin@mail.com", "(353) 22 87 8356"]
  // ]
  let headerTable = [];

  // data.subscribe(value => {
  //   console.log(value);
  //   state = value;
  // });

  afterUpdate(() => {
    console.log($state);
    console.log(cells)
    console.log(666,borderCover,selCoordinates)
  })

  if ($state[0]) {
    headerTable = Object.keys($state[0]);
  }

  export const cells = [] //new Array(20+1).fill(new Array(colsCount)); //"A".charCodeAt(0)
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
    // console.log(cells[1][1].$$.context)
    // console.log(cells[1][1].$set)
    // console.log(cells[1][1].width, cells[1][1].height)
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
  //bind:cell='{cells[index1][index2]}'
</script>

<!--language=Pug-->
<template lang="pug">
  Eventbus(
    on:nullDelta='{nullDelta}'
  )
    div.table(bind:this='{table}')
      Row
        +each('cols as col, index (1000 + index)')
          Column(bind:cell='{cells[0][index]}') {col}
      +each('rows as row, index1 (3000 + index1)')
        Row(index="{index1}")
          +each('cols as col, index2 (4000 + index2)')
            Cell(
              row="{index1}"
              column="{index2}"
              value='{$state[index1][index2]}'
              bind:html='{$state[index1][index2]}'
              bind:cell='{cells[index1][index2]}'
            )
      Selection(
        bind:select='{selCoordinates}'
        bind:borderCover='{borderCover}'
        deltaCols="{deltaCoordinates}"
        on:nullDelta='{nullDelta}'
      )
    SelectionMoveView(
      borderCover='{borderCover}'
      on:newSelectCoords='{handleCoords}'
      on:nullCoordinates='{nullCoordinates2}'
    )
</template>

<style lang="scss" module>
  @import "./table.scss";
</style>
