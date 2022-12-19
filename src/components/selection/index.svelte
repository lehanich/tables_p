<script>
  import { onMount, getContext } from 'svelte';
	import { select_option } from 'svelte/internal';
  import {repeat, filter, seq, once, any, on, every, onlyEvent, onlyEvents } from "../../lib/eventIter.js";
  import SelectionAreaView from "./selectionArea.svelte";
  import SelectionBorderView from "./selectionBorder.svelte";
  import SelectionCellView from "./selectionCell.svelte";
  import SelectionButtonView from "./selectionButton.svelte";
  // import SelectionMoveView from "./moveSelection.svelte";

  const { getSelect, getCells, getTable } = getContext("show");
  
  export let borderCover;
  let selWidth = 0
  let selHeight = 0;
  let selTop = 0;
  let selLeft = 0;

  $: selCell = {
    height:0,
    width:0,
    top:0,
    left:0
  }
  $: selSpace = {
    height: selHeight,
    width: selWidth,
    top: selTop,
    left: selLeft
  }

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
          // var table = document.getElementsByClassName('table')[0];
          // console.dir(table)
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

          let select = Array(2).fill(Array(2)); // first last
          let xCursor = cells[0][Symbol.iterator]();
          let yCursor = cells[Symbol.iterator]();
          let first 
          (async() => {for await (const ev of getSelect()) {
            console.log(ev) //ev.currentTarget

            let xEl = xCursor.next();
            let yEl = yCursor.next();

            if((ev.value && ev.value.type === "mousedown") || ev.type === "mousedown") 
            {
              let i = 0;
              for (let xEl of cells[0]) {
                // console.log(ev.pageX , xEl.offsetLeft , ev.pageX , xEl.offsetLeft + xEl.offsetWidth)
                if(ev.pageX > xEl.offsetLeft && ev.pageX < xEl.offsetLeft + xEl.offsetWidth) {
                  //stop
                  console.dir( xEl)
                  select[0][0] = i

                  selCell.left = xEl.offsetLeft
                  selCell.width = xEl.offsetWidth

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
                  selCell.top =yEl.offsetTop ;
                  selCell.height = yEl.offsetHeight

                  selTop =yEl.offsetTop ;
                  selHeight = yEl.offsetHeight

                  // console.log("selSpace",selSpace, yEl.offsetTop ,  offsetTop)
                }
                i++
              }
            } else {
              // console.log(ev)
            }
            // console.log(select)
            if(select[0][0] && select[0][1] &&  ev.type === "mousemove") {
              let firstX = cells[0][select[0][0]];
              let firstY = rows[select[0][1]]
              selWidth = firstX.offsetWidth
              selHeight = firstY.offsetHeight

              if(ev.pageX > firstX.offsetLeft) {
                // console.log(ev)
                for(let i = select[0][0] ; i < cells[0].length; i++ ) {
                  xEl = cells[0][i];
                   selLeft = firstX.offsetLeft
                  //  console.log("selLeft", xEl)
                  if(ev.pageX > xEl.offsetLeft && ev.pageX > firstX.offsetLeft + selWidth) {
                    selWidth += xEl.offsetWidth;
                  }
                  // console.log("selLeft", selLeft);
                }
              } else {
                for(let i = select[0][0] ; i >=0 ; i-- ) {
                  xEl = cells[0][i];
                  if(ev.pageX < xEl.offsetLeft && ev.pageX < firstX.offsetLeft +  firstX.offsetWidth - selWidth) {
                    selWidth += xEl.offsetWidth;

                    selLeft = firstX.offsetLeft +  firstX.offsetWidth - selWidth
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

                    if (ev.pageX > firstX.offsetLeft) {
                      //// selCell.top = firstY.offsetTop + offsetTop + firstY.offsetHeight - selHeight
                    } else {
                      //// selCell.top = firstY.offsetTop + offsetTop + firstY.offsetHeight - selHeight
                      selLeft = firstX.offsetLeft +  firstX.offsetWidth - selWidth
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
