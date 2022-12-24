<script>
  import { onMount, getContext, afterUpdate,createEventDispatcher } from 'svelte';
  import {createEventbusDispatcher} from '../../lib/eventBus';
	import { select_option } from 'svelte/internal';
  import {repeat, filter, seq, once, any, on, every, onlyEvent, onlyEvents } from "../../lib/eventIter.ts";
  import SelectionAreaView from "./selectionArea.svelte";
  import SelectionBorderView from "./selectionBorder.svelte";
  import SelectionCellView from "./selectionCell.svelte";
  import SelectionButtonView from "./selectionButton.svelte";
  // import SelectionMoveView from "./moveSelection.svelte";

  const { getSelect, getCells, getTable } = getContext("show");

  // const dispatch = createEventDispatcher();
  const dispatch = createEventbusDispatcher(); // createEventDispatcher();
  console.log("event bus",dispatch);
  console.dir(dispatch);

  export let borderCover;
  export let select;

  let selWidth = 0
  let selHeight = 0;
  let selTop = 0;
  let selLeft = 0;
  let selCellLeft = 0;
  let selCellTop = 0;
  let selCellWidth = 0;
  let selCellHeight = 0;



  $: selCell = {
    height: selCellHeight,
    width: selCellWidth,
    top: $$props.deltaCols[1] ? $$props.deltaCols[1] + selCellTop : selCellTop ,
    left: $$props.deltaCols[0] ? $$props.deltaCols[0] + selCellLeft : selCellLeft
  }
  $: selSpace = {
    height: selHeight,
    width: selWidth,
    top: $$props.deltaCols[1] ? $$props.deltaCols[1] +  selTop : selTop,
    left: $$props.deltaCols[0] ? $$props.deltaCols[0] + selLeft : selLeft
  }

  afterUpdate(() => {
    console.log("4444 1", $$props.deltaCols)
    console.log("444 6", borderCover)
    // selLeft += $$props.deltaCols[0]
    // selTop += $$props.deltaCols[1]
    // selCellLeft += $$props.deltaCols[0]
    // selCellTop +=  $$props.deltaCols[1]
    console.log("444 9", selCell,selSpace)
  })

  const loadWorker = async () => {
    // (async () => {
      var shiftX = 0;
      var shiftY = 0;

      console.log(getSelect)
      console.log(getSelect())

      setTimeout(() => {
        let cells = getCells();
        if (cells) {
          console.log(7,cells)
        }

        if(getSelect() && typeof getSelect()[Symbol.asyncIterator] === 'function') {
          let offsetTop = getTable().offsetTop;
          let offsetLeft = getTable().offsetLeft;

          let rows = new Array();
          let i = 0;
          for (const child of getTable().children) {
            if(child.classList.contains("row")) {
              rows[i] = child;
              i++
            }
          }

          select = [[], []]; // Array(2).fill(Array(2)); // first last
          let xCursor = cells[0][Symbol.iterator]();
          let yCursor = cells[Symbol.iterator]();
          let first;

        (async() => {
          for await (const ev of getSelect()) {
            console.log(ev) //ev.currentTarget

            let xEl = xCursor.next();
            let yEl = yCursor.next();

            if((ev.value && ev.value.type === "mousedown") || ev.type === "mousedown") 
            {
              dispatch('nullDelta', { coords: [0,0] });
              // dispatch('nullDelta');
              let i = 0;
              for (let xEl of cells[0]) {
                // console.log("555",ev.pageX , xEl.offsetLeft ,xEl.offsetLeft + xEl.offsetWidth)
                if(ev.pageX > xEl.offsetLeft && ev.pageX < xEl.offsetLeft + xEl.offsetWidth) {
                  //stop
                  // console.log( "555", i, xEl)
                  // console.log("555",ev.pageX , xEl.offsetLeft ,xEl.offsetLeft + xEl.offsetWidth)
                  // console.log("666 1", select[0], select[1])
                  select[0][0] = i
                  select[1][0] = i
                  // console.log("666 2", select[0], select[1])

                  selCellLeft = xEl.offsetLeft
                  selCellWidth = xEl.offsetWidth

                  selLeft = xEl.offsetLeft
                  selWidth = xEl.offsetWidth
                  // console.log("selSpace",selSpace)
                }
                i++
              }
            } else {
              console.log(ev)
            }
            //y

            if((ev.value && ev.value.type === "mousedown") || ev.type === "mousedown")
            {
              let i = 0;
              // for (let yEl of cells) {
                // console.log("selSpace 1 ",rows[0].offsetTop);
              for (const yEl of rows) {
                // console.log("y", yEl.offsetTop + offsetTop, yEl.offsetHeight, yEl.clientHeight)
                if(ev.pageY > yEl.offsetTop + offsetTop && ev.pageY < yEl.offsetTop + offsetTop + yEl.offsetHeight) {
                  //stop
                  console.dir( yEl)
                  // console.dir(rows)
                  select[0][1] = i
                  select[1][1] = i
                  selCellTop =yEl.offsetTop ;
                  selCellHeight = yEl.offsetHeight

                  selTop =yEl.offsetTop ;
                  selHeight = yEl.offsetHeight

                  // console.log("selSpace",selSpace, yEl.offsetTop ,  offsetTop)
                }
                i++
              }
            } else {
              // console.log(ev)
            }
            // console.log(555,select)
            if(select[0][0] !== null && select[0][0] !== undefined &&
            select[0][1] !== null && select[0][1] !== undefined &&  ev.type === "mousemove") {
              let firstX = cells[0][select[0][0]];
              let firstY = rows[select[0][1]]
              selWidth = firstX.offsetWidth
              selHeight = firstY.offsetHeight

              // console.log("555",ev.pageX, firstX.offsetLeft)
              if(ev.pageX > firstX.offsetLeft) {
                // console.log(ev)
                
                for(let i = select[0][0] ; i < cells[0].length; i++ ) {
                  xEl = cells[0][i];
                   selLeft = firstX.offsetLeft
                  //  console.log("555 ", ev.pageX , xEl.offsetLeft ,  firstX.offsetLeft + selWidth)
                  if(ev.pageX > xEl.offsetLeft && ev.pageX > firstX.offsetLeft + selWidth) {
                    selWidth += xEl.offsetWidth;
                    select[1][0] = i+1
                  }
                  // console.log("selLeft", selLeft);
                }
              } else {
                for(let i = select[0][0] ; i >=0 ; i-- ) {
                  xEl = cells[0][i];
                  if(ev.pageX < xEl.offsetLeft && ev.pageX < firstX.offsetLeft +  firstX.offsetWidth - selWidth) {
                    selWidth += xEl.offsetWidth;

                    selLeft = firstX.offsetLeft +  firstX.offsetWidth - selWidth
                    select[1][0] = i-1
                    // console.log("selLeft", selLeft);
                  }
                  // console.log("selLeft", selLeft);
                }
              }
              if(ev.pageY > firstY.offsetTop + offsetTop ) {
                // console.log(ev)
                for(let i = select[0][1] + 1; i < rows.length -1; i++ ) {
                  yEl = rows[i];
                  // console.log(i, yEl)
                  selTop = firstY.offsetTop ;

                  if(ev.pageY > yEl.offsetTop + offsetTop && ev.pageY > firstY.offsetTop + offsetTop + selHeight) {
                    selHeight += yEl.offsetHeight;
                    select[1][1] = i
                  }
                }
              } else {
                for(let i = select[0][1]-1; i >= 0; i-- ) {
                  yEl = rows[i];
                  // console.log(ev.pageY , yEl.offsetTop + offsetTop + yEl.offsetHeight)
                  if(ev.pageY < yEl.offsetTop + offsetTop + yEl.offsetHeight &&
                    ev.pageY < firstY.offsetTop + offsetTop + firstY.offsetHeight - selHeight) {
                    selHeight += yEl.offsetHeight;

                    selTop = firstY.offsetTop  + firstY.offsetHeight - selHeight
                    select[1][1] = i
                    if (ev.pageX > firstX.offsetLeft) {
                      //// selCell.top = firstY.offsetTop + offsetTop + firstY.offsetHeight - selHeight
                    } else {
                      //// selCell.top = firstY.offsetTop + offsetTop + firstY.offsetHeight - selHeight
                      selLeft = firstX.offsetLeft +  firstX.offsetWidth - selWidth
                      select[1][1] = i
                      // console.log("selLeft", selLeft);
                    }

                  }
                }
              }
            }
          }
          })()
        }
      },500)

      // function isIterable(input) {  
      //   if (input === null || input === undefined) {
      //     return false
      //   }

      //   return typeof input[Symbol.iterator] === 'function'
      // }
    // })()
  }

  onMount(loadWorker);
</script>

<template lang="pug">
  SelectionAreaView(selSpace='{selSpace}') &nbsp;
  SelectionBorderView.range-border(selSpace='{selSpace}' bind:borderCover='{borderCover}')
  SelectionCellView.range-border(selCell='{selCell}' bind:borderCover='{borderCover}')
  SelectionButtonView(selSpace='{selSpace}')

</template>

<style lang="scss" module>
  :global(.range-border) {
    position: absolute;
    border-width: 0;
    border-style: solid;
    padding: 0;
    _overflow: hidden;
  }
</style>
