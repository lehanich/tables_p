<script>
  import { onMount, getContext } from 'svelte';
  import {repeat, filter, seq, once, any, on, every, onlyEvent } from "../../lib/eventIter.js";
  let selectionArea
  let selectionBorder
  let activeSide
  let selectionCell
  let moveButton

  const { getShow, getCells } = getContext("show");
  // let cells = getCells();

  let selWidth = 0
  let selHeight = 0;
  $: selCell = {
    height:0,
    width:0,
    top:0,
    left:0
  }
  $: selSpace = {
    height:0,
    width:0,
    top:0,
    left:0
  }
  $: style1 = `
    position: absolute;
    background-color: rgb(14, 101, 235);
    opacity: 0.1;
    top: ${selCell.top}px;
    left: ${selCell.left}px;
    width: ${selWidth}px;
    height: ${selHeight}px;
  `
  // var table = document.getElementsByClassName('table')[0];
  //   // console.log(cell);
  //   console.log(table);
  //   (async () => {
  //     const show = 
  //       repeat(() => 
  //         filter(
  //           seq(
  //             once(table, 'mousedown'),
  //             every(
  //               any(
  //                 on(table, 'mousemove'),
  //                 on(table, 'mouseup')
  //               ),
  //               onlyEvent('mousemove')
  //             )
  //           ),
  //           onlyEvent('mousemove')
  //         )
  //       );
   
  //     var shiftX = 0;
  //     var shiftY = 0;

  //     for await (const ev of show) {
  //       console.log(ev.currentTarget)
  //       // ev.currentTarget.
  //       // const { top, left } = getCoords(ball);
  //       // var shiftX = ev.pageX - top;
  //       // var shiftY = ev.pageY - left;
        
  //     //  ball.style.left = ev.pageX - shiftX + 'px';
  //     //   ball.style.top = ev.pageY - shiftY + 'px';

  //     }

  //   })()
    
  const loadWorker = async () => {
    console.log(3,selectionCell)
    console.log(9,moveButton)
    // (async () => {
      var shiftX = 0;
      var shiftY = 0;

      console.log(getShow)
      console.log(getShow())

      setTimeout(() => {
        let cells = getCells();
        if (cells) {
          console.log(7,cells)
        }
        if(getShow() && typeof getShow()[Symbol.asyncIterator] === 'function') {
          var table = document.getElementsByClassName('table')[0];
          console.dir(table)
          let offsetTop = table.offsetTop;
          let offsetLeft = table.offsetLeft;
          let rows = new Array();
          let i = 0;
          for (const child of table.children) {
            console.log(child);
            console.log(child.offsetTop + offsetTop,child.offsetHeight, child.clientHeight)
            rows[i] = child;
            i++
          }

          let select = Array(2).fill(Array(2)); // first last
          let xCursor = cells[0][Symbol.iterator]();
          let yCursor = cells[Symbol.iterator]();
          let first 
          (async() => {for await (const ev of getShow()) {
            console.log(ev) //ev.currentTarget
            selWidth++
            selHeight++
            console.log(style1)
            // ev.currentTarget.
            // const { top, left } = getCoords(ball);
            // var shiftX = ev.pageX - top;
            // var shiftY = ev.pageY - left;
            
          //  ball.style.left = ev.pageX - shiftX + 'px';
          //   ball.style.top = ev.pageY - shiftY + 'px';
            //x
            console.dir(cells[0][1])
            console.log("x", cells[0][1].offsetLeft, cells[0][1].offsetWidth, cells[0][1].clientWidth)
            console.log("y", rows[1].offsetTop + offsetTop, rows[1].offsetHeight, rows[1].clientHeight)

            console.log("x",ev.pageX , " y", ev.pageY);

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
                  select[0][0] = xEl
                  selCell.left = xEl.offsetLeft
                  selCell.width = xEl.offsetWidth
                  selSpace.left = xEl.offsetLeft

                  selSpace.width = xEl.offsetWidth
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
              for (const yEl of rows) {
                console.log("y", yEl.offsetTop + offsetTop, yEl.offsetHeight, yEl.clientHeight)
                if(ev.pageY > yEl.offsetTop + offsetTop && ev.pageY < yEl.offsetTop + offsetTop + yEl.offsetHeight) {
                  //stop
                  console.dir( yEl)
                  select[0][1] = yEl
                  selCell.top =yEl.offsetTop + offsetTop;
                  selCell.height = yEl.offsetHeight
                  selSpace.top =yEl.offsetTop + offsetTop;

                  selSpace.height = yEl.offsetHeight
                }
                i++
              }
            } else {
              console.log(ev)
            }
            console.log(select)
            // if(select[0][0] && select[0][1]) {
            //   first = cells[select[0][0]][select[0][1]]

            //   if(!(ev.pageX > first.offsetLeft && ev.pageX < first.offsetLeft + first.offsetWidth)) {
            //       console.log(ev)
            //   }
            //   if(!(ev.pageY > first.offsetTop && ev.pageY < first.offsetTop + first.offsetHeight)) {
            //     console.log(ev)
            //   }
            // }

            // if (select[0][0] && select[0][1]) {
            //   first = cells[0]
            // }
// offsetHeight 24
// offsetLeft 40
// offsetTop 24
// offsetWidth 120

// //

// clientHeight 23
// clientWidth 119

//ev
// clientX 91
// clientY 339
// layerX 91
// layerY 241
// offsetX 52
// offsetY 1
// pageX 91
// pageY 339
          }
          })()
        }
      },500)

      function isIterable(input) {  
        if (input === null || input === undefined) {
          return false
        }

        return typeof input[Symbol.iterator] === 'function'
      }
    // })()
  }

  onMount(loadWorker);
    // //- script.
    // let selectionArea
    // let selectionBorder
    // let activeSide
    // let selectionCell
    // let moveButton
</script>
<template lang="pug">

  div.selection(bind:this='{selectionArea}' style="{style1}") &nbsp;
  
  div(bind:this='{selectionBorder}' style="position: absolute; border-width: 0px; padding: 0px; height: 0px; width: 0px; top: 252px; left: 717px;")
    div.range-border.selection-border(style="border-top-width: 1px; user-select: none; opacity: 1; top: -1px; left: -1px; width: 202.5px;")
    div.range-border.selection-border(style="border-bottom-width: 1px; user-select: none; opacity: 1; top: 125px; left: -1px; width: 202.5px;")
    div.range-border.selection-border(style="border-right-width: 1px; user-select: none; opacity: 1; top: -1px; left: 201px; height: 126.5px;")
    div.range-border.selection-border(style="border-left-width: 1px; user-select: none; opacity: 1; top: -1px; left: -1px; height: 126.5px;")

  div.cellSelection(bind:this='{selectionCell}' style="position: absolute; border-width: 0px; padding: 0px; width: 0px; height: 0px; top: {selCell.top}px; left: {selCell.left}px;")
    div.range-border.active-cell-border(style="border-top-width: 2px; user-select: none; top: -1px; left: -1px; width: {selCell.width}px;")
    div.range-border.active-cell-border(style="border-bottom-width: 2px; user-select: none; top: {selCell.height-2}px; left: -1px; width: {selCell.width}px;")
    div.range-border.active-cell-border(style="border-right-width: 2px; user-select: none; top: -1px; left: {selCell.width-2}px; height: {selCell.height}px;")
    div.range-border.active-cell-border(style="border-left-width: 2px; user-select: none; top: -1px; left: -1px; height: {selCell.height}px;")

  div(bind:this='{moveButton}' style="position: absolute; border-width: 0px; padding: 0px; width: 8px; height: 8px; top: 372px; left: 914px;")
    div.autofill-handle.autofill-handle-ltr
    div.autofill-cover(style="top: 0px; left: 0px;")

  div.selection-border-cover(bind:this='{activeSide}')

</template>

<style lang="scss" module>
.cellSelection {
    position: absolute;
    border-width: 0px;
    padding: 0px;
    width: 0px;
    height: 0px;
    top: 567px;
    left: 132px;
  }
.selection {
    position: absolute;
    background-color: rgb(14, 101, 235);
    opacity: 0.1;
    top: 252px;
    left: 717px;
    width: 202px;
    height: 126px;
  }
.autofill-handle-ltr {
    border-width: 1px 0 0 1px;
}
.autofill-handle {
    background-color: #1a73e8;
    border: 1px solid white;
    height: 6px;
    margin-top: 1px;
    position: absolute;
    width: 6px;
    z-index: 8;
  }
.autofill-cover {
    position: absolute;
    cursor: crosshair;
    width: 8px;
    height: 8px;
    z-index: 9;
  }
.selection-border {
    border-color: #1a73e8;
    line-height: 0;
    z-index: 7;
}
.active-cell-border {
    border-color: #1a73e8;
    line-height: 1px;
    z-index: 7;
}
.range-border {
    position: absolute;
    border-width: 0;
    border-style: solid;
    padding: 0;
    _overflow: hidden;
}
</style>