<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import Row from "./row.svelte";
  import Column from "./column.svelte";
  import Cell from "./cell.svelte";
  import Selection from "../selection/index.svelte";
  import SelectionMoveView from "../selection/moveSelection.svelte";
  import {repeat, filter, seq, once, any, on, every, onlyEvent, onlyEvents } from "../../lib/eventIter.js";

  let selectSpace: AsyncGenerator<HTMLElementEventMap>;
  let table: DOMPoint;

  let borderCover;

  let deltaCols: [number, number] = [0, 0];

  function handleCoords(event) {
    console.log("444", event.detail.coords)
		deltaCols = [...event.detail.coords];
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
  const rows = new Array(20+1);
  const cols = new Array(colsCount).fill('').map(toChar); //.map(toColumn).join('');

  export const cells = new Array(20+1).fill(new Array(colsCount)); //"A".charCodeAt(0)

  const onLoad = async () => {
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
            onlyEvents('mousedown','mousemove')
          )
        );
  }

  onMount(onLoad);
  //bind:cell='{cells[index1][index2]}'
</script>
 
<template lang="pug">
  div.table(bind:this='{table}')
    Row
      +each('cols as col, index')
        Column(bind:cell='{cells[0][index]}') {col}
    +each('rows as row, index1')
      Row(index="{index1}")
        +each('cols as col, index2')
          Cell(row="{index1}" column="{col}")
    Selection(bind:borderCover='{borderCover}' deltaCols="{deltaCols}")
  SelectionMoveView(borderCover='{borderCover}' on:newSelectCoords='{handleCoords}')
</template>

<style lang="scss" module>
  @import "./table.scss";
</style>