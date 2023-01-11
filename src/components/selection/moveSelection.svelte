<script lang="ts">
  import { onMount, getContext, afterUpdate, createEventDispatcher } from 'svelte';
  import {repeat, filter, seq, once, any, on, every2, onlyEvent, onlyEvents } from "../../lib/eventIter";
  import { stateCoordinates } from "../../lib/data/stores";

  const dispatch = createEventDispatcher();

  let activeSide: HTMLDivElement
  let selectArea;
  let deltaCols: [number, number] = [0, 0];
  let deltaCoordinates: [number, number] = [0, 0];
  const { getTable, getCells, getSelectArea } = getContext("show");
  let selectCover ; //= getSelectArea();
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
    //border: 1px solid black;
  `;
  $: borderCoverMove = {
    left: moveX ? moveX : borderCover.width < borderCover.height ? borderCover.left - 102 : borderCover.left - 150,
    top: moveY ? moveY : borderCover.width < borderCover.height ? borderCover.top - 150 : borderCover.top - 102,
    width: borderCover.width < borderCover.height ? 205 : borderCover.width + 301,
    height: borderCover.width < borderCover.height ? borderCover.height + 301 : 205,
    cursor: "-webkit-grabbing"
  }

  $: selectArea = { ...$$props.borderCover }
  $: selectCover = { ...$$props.selectCover }

  function handleClick(e) { // костыль bug fix ???
    if (mousedown) {
      mousedown = !mousedown;
    }
  }

  afterUpdate(() => {
    console.log("SELECT AREA", selectCover, getSelectArea());
    
    borderCover = {
      ...borderCover,
      ...$$props.borderCover,
      top: $$props.borderCover?.top + getTable().offsetTop,
      cursor: "-webkit-grab"
    };

    if (borderCover.width < borderCover.height) {
      borderCover.width = 5;
      borderCover.left = borderCover.left - 2;
    } else {
      borderCover.height = 5;
      borderCover.top = borderCover.top - 2;
    }
  });

  const onLoad = async () => {
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
      let xOffset;
      let yOffset;

      (async() => {
        for await (const ev of activeSideActions) {
          let xEl = xCursor.next();
          let yEl = yCursor.next();
          // console.log("move event", ev)

          if ((ev.value && ev.value.type === "mousedown") || ev.type === "mousedown") {
            mousedown = true

            let i = 0;

            borderCover = {...borderCoverMove}
            xOffset = ev.pageX - borderCoverMove.left;
            yOffset = ev.pageY - borderCoverMove.top;
            deltaCols = [0,0];
            deltaCoordinates = [0,0];

            for (let xEl of cells[0]) {
              let pageX = ev.pageX <= selectCover.left ? selectCover.left + 1 :
                ev.pageX >= selectCover.left + selectCover.width ? selectCover.left + selectCover.width - 2  : ev.pageX ;
              if(pageX > xEl.offsetLeft && pageX < xEl.offsetLeft + xEl.offsetWidth) {
                  select[0][0] = i
              }
              i++
            }

            i = 0;
            for (const yEl of rows) {
              let pageY = ev.pageY <= selectCover.top  + offsetTop ? selectCover.top  + offsetTop + 1 :
                ev.pageY >= selectCover.top + selectCover.height  + offsetTop ? selectCover.top + selectCover.height  + offsetTop - 2  : ev.pageY ;

                if(pageY > yEl.offsetTop + offsetTop && pageY < yEl.offsetTop + offsetTop + yEl.offsetHeight) {
                select[0][1] = i;
              }
              i++;
            }
          }

          if (select[0][0] !== null && select[0][0] !== undefined &&
            select[0][1] !== null && select[0][1] !== undefined && ev.type === "mousemove") {
            
            let firstX = cells[0][select[0][0]];
            let firstY = rows[select[0][1]]

            moveX = ev.pageX - xOffset;
            moveY = ev.pageY - yOffset;
            deltaCols = [0,0];
            deltaCoordinates = [0,0];

            if(ev.pageX > firstX.offsetLeft + firstX.offsetWidth) {
              for(let i = select[0][0] ; i < cells[0].length; i++ ) {
                xEl = cells[0][i];

                if(ev.pageX > xEl.offsetLeft && ev.pageX < xEl.offsetLeft+ firstX.offsetWidth + deltaCols[0] ) {
                  deltaCols[0] = i - select[0][0]; // deltaCols[0] + xEl.offsetWidth
                  deltaCoordinates[0] = xEl.offsetLeft - firstX.offsetLeft;
                }
              }
            } else if (ev.pageX < firstX.offsetLeft) {
              for(let i = select[0][0] + 1 ; i >=0 ; i-- ) {
                xEl = cells[0][i];

                if(ev.pageX > xEl.offsetLeft && ev.pageX < firstX.offsetLeft + deltaCols[0]  && ev.pageX < xEl.offsetLeft + xEl.offsetWidth) {
                  deltaCols[0] = i - select[0][0]; //deltaCols[0] - xEl.offsetWidth;
                  deltaCoordinates[0] = xEl.offsetLeft - firstX.offsetLeft;
                }
              }
            }

            if(ev.pageY > firstY.offsetTop + firstY.offsetHeight + offsetTop) {
              for(let i = select[0][1] ; i < rows.length -1; i++ ) {
                yEl = rows[i];
                if(ev.pageY > yEl.offsetTop + offsetTop && ev.pageY < yEl.offsetTop + yEl.offsetHeight + offsetTop) {
                  deltaCols[1] = i - select[0][1];
                  deltaCoordinates[1] = yEl.offsetTop -  firstY.offsetTop;
                }
              }

            } else if (ev.pageY < firstY.offsetTop + offsetTop) {
              for(let i = select[0][1]-1; i >= 0; i-- ) {
                yEl = rows[i];
                if(ev.pageY > yEl.offsetTop + offsetTop && ev.pageY < yEl.offsetTop + yEl.offsetHeight + offsetTop ) {
                    deltaCols[1] = i - select[0][1];
                    deltaCoordinates[1] =  yEl.offsetTop -  firstY.offsetTop;
                }
              }
            }
          }

          if (ev.type === "mouseup") {
            let i = 0;

            moveX = null;
            moveY = null;
            dispatch('newSelectCoords', { coords: [...deltaCoordinates], cols: [...deltaCols] });
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
    style='{borderCoverStyle}'
    on:click='{handleClick}'
  )
</template>

<style lang="scss">
  .selection-border-cover {
    position: absolute;
    z-index: 7;
  }
</style>
