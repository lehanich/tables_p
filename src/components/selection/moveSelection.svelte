<script lang="ts">
  import { onMount, getContext, afterUpdate, createEventDispatcher } from 'svelte';
  import {repeat, filter, seq, once, any, on, every2, onlyEvent, onlyEvents } from "../../lib/eventIter.js";

  const dispatch = createEventDispatcher();

  let activeSide: HTMLDivElement

  let deltaCols: [number, number] = [0, 0];

  const { getTable, getCells } = getContext("show");

  let borderCover = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    cursor: "-webkit-grab" // -webkit-grabbing
  }
  let mousedown = false;
  let borderCoverMove;
  let moveX;
  let moveY;

  $: borderCoverStyle = `
    cursor:  ${mousedown ? borderCoverMove?.cursor : borderCover.cursor};
    left: ${mousedown ? borderCoverMove?.left : borderCover.left}px;
    top:  ${mousedown ? borderCoverMove?.top : borderCover.top}px;
    width:  ${mousedown ? borderCoverMove?.width : borderCover.width}px;
    height:  ${mousedown ? borderCoverMove?.height : borderCover.height}px;
    border: 1px solid black;
  `
  $:  borderCoverMove = {
    left: moveX ? moveX : borderCover.width < borderCover.height ? borderCover.left - 102 : borderCover.left - 150,
    top: moveY ? moveY : borderCover.width < borderCover.height ? borderCover.top - 150 : borderCover.top - 102,
    width: borderCover.width < borderCover.height ? 205 : borderCover.width + 301,
    height: borderCover.width < borderCover.height ? borderCover.height + 301 : 205,
    cursor: "-webkit-grabbing"
  }

  afterUpdate(() => {
    console.log($$props)
    borderCover = {
      ...borderCover,
      ...$$props.borderCover,
      top: $$props.borderCover?.top + getTable().offsetTop,
      cursor: "-webkit-grab"
    };

    borderCover.left += deltaCols[0] ? deltaCols[0] : 0;
    borderCover.top +=  deltaCols[1] ? deltaCols[1] : 0;

    if (borderCover.width < borderCover.height) {
      borderCover.width = 5;
      borderCover.left = borderCover.left - 2;
    //   borderCoverMove = {
    //     left: borderCover.left - 102,
    //     top: borderCover.top - 150,
    //     width: 205,
    //     height: borderCover.height + 301,
    //     cursor: "-webkit-grabbing"
    //   };
    } else {
      borderCover.height = 5;
      borderCover.top = borderCover.top - 2;
    //   borderCoverMove = {
    //     left: borderCover.left - 150,
    //     top: borderCover.top - 102,
    //     width: borderCover.width + 301,
    //     height: 205,
    //     cursor: "-webkit-grabbing"
    //   };
    }

    // borderCoverMove.left = moveX ? moveX : borderCoverMove.left;
    // borderCoverMove.top = moveY ? moveY : borderCoverMove.top;

  });

  const onLoad = async () => {
        console.log(activeSide)
        // var activeSide = document.getElementById('test');
      let activeSideActions = repeat(() => 
          filter(
            seq(
              once(activeSide, 'mousedown'),
              every2(
                any(
                  on(activeSide, 'mousemove'),
                  on(activeSide, 'mouseup')
                ),
                onlyEvent('mousemove')
              )
            ),
            onlyEvents('mousedown', 'mousemove', 'mouseup')
          )
      );

      activeSide.ondragstart = function() {
        return false;
      };

      setTimeout(() => {
        let cells = getCells();

        let offsetTop = getTable().offsetTop;
        let offsetLeft = getTable().offsetLeft;

        let rows = new Array();
        let i = 0;
        for (const child of getTable().children) {
          if(child.classList.contains("row")) {
            rows[i] = child;
            i++;
          }
        }

        let select = Array(2).fill(Array(2));
        let xCursor = cells[0][Symbol.iterator]();
        let yCursor = cells[Symbol.iterator]();
      

        let xOffset
        let yOffset

        (async() => {
          for await (const ev of activeSideActions) {
            console.log(ev)

            let xEl = xCursor.next();
            let yEl = yCursor.next();

            
          
            if ((ev.value && ev.value.type === "mousedown") || ev.type === "mousedown") {
              mousedown = true

              let i = 0;

              console.log(borderCoverMove)

              borderCover = {...borderCoverMove}
              xOffset = ev.pageX - borderCoverMove.left;
              yOffset = ev.pageY - borderCoverMove.top;
              console.log(xOffset, yOffset)

              deltaCols = [0,0]

              for (let xEl of cells[0]) {
                console.log(ev.pageX , xEl.offsetLeft , ev.pageX , xEl.offsetLeft + xEl.offsetWidth)
                if(ev.pageX > xEl.offsetLeft && ev.pageX < xEl.offsetLeft + xEl.offsetWidth) {
                  //stop
                  console.dir( xEl)
                  select[0][0] = i
                  console.log("click x ", xEl.offsetLeft)
                }
                i++
              }

              i = 0;
              for (const yEl of rows) {
                // console.log("y", yEl.offsetTop + offsetTop, yEl.offsetHeight, yEl.clientHeight)
                if(ev.pageY > yEl.offsetTop + offsetTop && ev.pageY < yEl.offsetTop + offsetTop + yEl.offsetHeight) {
                  //stop
                  console.dir( yEl)
                  // console.dir(rows)
                  select[0][1] = i
                  console.log("click y ", yEl.offsetTop)
                }
                i++
              }
            }
            
            console.log(2, select[0]);

            if (select[0][0] && select[0][1] && ev.type === "mousemove") {
              let firstX = cells[0][select[0][0]];
              let firstY = rows[select[0][1]]

              // borderCover.left = ev.
              // borderCover.top
              moveX = ev.pageX - xOffset;
              moveY = ev.pageY - yOffset;

              deltaCols = [0,0];
              // console.log(3, ev.pageX , xOffset);
              // console.log(4, ev.pageY , yOffset);
              // console.log(5, borderCoverMove.left, borderCoverMove.top);




              if(ev.pageX > firstX.offsetLeft + firstX.offsetWidth) {
                for(let i = select[0][0] ; i < cells[0].length; i++ ) {
                  xEl = cells[0][i];
                  // selLeft = firstX.offsetLeft
                  // borderCover.left = borderCover.left + xEl.offsetLeft
                  //  console.log("selLeft", xEl)
                  console.log("111 5",ev.pageX , xEl.offsetLeft , xEl.offsetLeft+ firstX.offsetWidth + deltaCols[0])
                  if(ev.pageX > xEl.offsetLeft && ev.pageX < xEl.offsetLeft+ firstX.offsetWidth + deltaCols[0] ) {
                    // borderCover.left = borderCover.left + firstX.offsetLeft
                    console.log("111 6",xEl.offsetLeft)
                    deltaCols[0] = xEl.offsetLeft - firstX.offsetLeft; // deltaCols[0] + xEl.offsetWidth
                  }
                  // console.log("selLeft", selLeft);
                }
              } else if (ev.pageX < firstX.offsetLeft) {
                for(let i = select[0][0] + 1 ; i >=0 ; i-- ) {
                  xEl = cells[0][i];
                  // console.log(1112, ev.pageX , xEl.offsetLeft, firstX.offsetLeft + deltaCols[0] )
                  // if(ev.pageX < xEl.offsetLeft && ev.pageX < firstX.offsetLeft +  firstX.offsetWidth - deltaCols[0]) {
                  if(ev.pageX > xEl.offsetLeft && ev.pageX < firstX.offsetLeft + deltaCols[0] ) {
                    // selWidth += xEl.offsetWidth;

                    // borderCover.left = borderCover.left - xEl.offsetLeft
                    // console.log("selLeft", selLeft);
                      // borderCover.left = borderCover.left + firstX.offsetLeft
                    // console.log("1112 7",xEl.offsetLeft, firstX.offsetLeft)
                    deltaCols[0] = xEl.offsetLeft - firstX.offsetLeft; //deltaCols[0] - xEl.offsetWidth;
                    // console.log("1112 8",deltaCols[0])
                  }
                  // console.log("selLeft", selLeft);
                }
              }
              

              
              if(ev.pageY > firstY.offsetTop + firstY.offsetHeight + offsetTop) {
                // console.log(ev)
                for(let i = select[0][1] ; i < rows.length -1; i++ ) {
                  yEl = rows[i];
                  // console.log(i, yEl)
                  // selTop = firstY.offsetTop ;
                  // console.log(10,ev.pageY, yEl.offsetTop + offsetTop,
                  // firstY.offsetTop + firstY.offsetHeight + offsetTop)
                  if(ev.pageY > yEl.offsetTop + offsetTop && ev.pageY < yEl.offsetTop + yEl.offsetHeight + offsetTop) {
                    // selHeight += yEl.offsetHeight;
                    console.log("111 8",yEl.offsetTop)
                    deltaCols[1] = yEl.offsetTop -  firstY.offsetTop
                  }
                }

              } else if (ev.pageY < firstY.offsetTop + offsetTop) {
                for(let i = select[0][1]-1; i >= 0; i-- ) {
                  yEl = rows[i];
                  // console.log(ev.pageY , yEl.offsetTop + offsetTop + yEl.offsetHeight)
                  if(ev.pageY > yEl.offsetTop + offsetTop && ev.pageY < yEl.offsetTop + yEl.offsetHeight + offsetTop) {
                      console.log("111 9",yEl.offsetTop)
                      deltaCols[1] = yEl.offsetTop -  firstY.offsetTop
                    // selHeight += yEl.offsetHeight;

                    // selTop = firstY.offsetTop  + firstY.offsetHeight - selHeight

                    // if (ev.pageX > firstX.offsetLeft) {
                    //   //// selCell.top = firstY.offsetTop + offsetTop + firstY.offsetHeight - selHeight
                    // } else {
                    //   //// selCell.top = firstY.offsetTop + offsetTop + firstY.offsetHeight - selHeight
                    //   selLeft = firstX.offsetLeft +  firstX.offsetWidth - selWidth
                    //   // console.log("selLeft", selLeft);
                    // }

                  }
                }
              }
              console.log(111,deltaCols)
            }

            if (ev.type === "mouseup") {
              // pageY = ev.pageY;
              // pageX = ev.pageX;
              let i = 0;
              
              moveX = null;
              moveY = null;
              dispatch('newSelectCoords', { coords: [...deltaCols] });
              // dispatch('newSelectCoords', { coords: [0,0] });
              
              borderCover.left += deltaCols[0] ? deltaCols[0] : 0;
              borderCover.top +=  deltaCols[1] ? deltaCols[1] : 0;

              deltaCols = [0,0]
              mousedown = false;
            }
          }
        })()
      },500);
  }

  onMount(onLoad);
</script>

<template lang="pug">
  div.selection-border-cover(
    bind:this='{activeSide}'
    style="{borderCoverStyle}"
  )
</template>

<style lang="scss">
  .selection-border-cover {
    position: absolute;
    z-index: 7;
  }
</style>
