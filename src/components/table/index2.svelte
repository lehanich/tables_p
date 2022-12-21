<script lang="ts">
  import { onMount, setContext, afterUpdate, tick } from 'svelte';
  import Row from "./row.svelte";
  import Column from "./column.svelte";
  import Cell from "./cell.svelte";
  import Selection from "../selection/index.svelte";
  import SelectionMoveView from "../selection/moveSelection.svelte";
  import {repeat, filter, seq, once, any, on, every, onlyEvent, onlyEvents } from "../../lib/eventIter.ts";
  // import {data} from "../toolbar/importCSV";

  let selectSpace: AsyncGenerator<HTMLElementEventMap>;
  let table: DOMPoint;

  let borderCover;

  let deltaCols: [number, number] = [0, 0];

  function nullCoordinates(event) {
    deltaCols = [0,0];
    console.log("444 11 null coords",event.detail.coords)
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
    console.log("444 11", event.detail.coords)
    console.log("444 11 ++",deltaCols)
		// deltaCols = [...event.detail.coords];
    deltaCols[0] += event.detail.coords[0];
    deltaCols[1] += event.detail.coords[1];
    borderCover.left += event.detail.coords[0]
    borderCover.top += event.detail.coords[1]
    console.log("444 11 --",deltaCols)
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
  const rows1 = new Array(20+1);
  // const cols1 = new Array(colsCount).fill('').map(toChar); //.map(toColumn).join('');
  const cols1 =  new Array(colsCount).fill('').map(toChar);
  // cols1.fill('').map(toChar);

  let state2 =  new Array(20+1).fill([]);// [];
  let state = [
    [],
    [],
    [],
    [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
  ]
  let headerTable = [];

  // data.subscribe(value => {
  //   console.log(value);
  //   state = value;
  // });

  let data = [
    ["John", "john@example.com", "(353) 01 222 3333"],
    ["Sarah", "sarah@gmail.com", "(01) 22 888 4444"],
    ["Afshin", "afshin@mail.com", "(353) 22 87 8356"],
    [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
  ]
  let rows = [0,1,2];
  let cols = [0,1,2]

  afterUpdate(() => {
    console.log(data);
    console.log(cells)
    console.dir(rows1)
    console.dir(cols1)
    console.dir(state)
    console.dir(state2)
  })

  if (state[0]) {
    headerTable = Object.keys(state[0]);
  }

  export const cells = new Array(20+1).fill(new Array(colsCount)); //"A".charCodeAt(0)

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
            onlyEvents('mousedown','mousemove')
          )
        );
  }

  onMount(onLoad);
  //bind:cell='{cells[index1][index2]}'
</script>

<!--language=Pug-->
<template lang="pug">
  div.table

    +each('rows as row, index1 (3000 + index1)')
      Row(index="{index1}")
        +each('cols1 as col, index2 (4000 + index2)')
          Cell(
            bind:html='{state2[index1][index2]}'
           
          )

</template>
<!-- 
<template>
  <Row>
    {#each cols as col, index (6000 + index)}
      <Column bind:cell={cells[0][index]}>
         {col}
      </Column>
	  {/each}
  </Row>
  <Row>
    {#each cols as col, index (3000 + index)}
      <Cell row="1" column="{col}" value="{headerTable[index]}">
         {col}
      </Cell>
	  {/each}
  </Row>
  {#each rows as row, index1 (9000 + index1)}
    <Row index="{index1}">
      {#each cols as col, index2 (index2)}
        <Cell
          row="{index1}"
          column="{index2}"
          value="{state[index1]?.[index2]}"
          bind:html='{state[index1][index2]}'
          bind:this='{cells[index1][index2]}'>
       
        </Cell>
      {/each}
    </Row>
  {/each}
</template>-->

<style lang="scss" module>
  @import "./table.scss";
</style>