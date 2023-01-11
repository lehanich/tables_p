<script>
  import { onMount, getContext, setContext, afterUpdate,createEventDispatcher } from 'svelte';
  import {createEventbusDispatcher} from '../../lib/eventBus';
	import { select_option } from 'svelte/internal';
  import {repeat, filter, seq, once, any, on, every, onlyEvent, onlyEvents } from "../../lib/eventIter";
  import SelectionAreaView from "./selectionArea.svelte";
  import SelectionBorderView from "./selectionBorder.svelte";
  import SelectionCellView from "./selectionCell.svelte";
  import SelectionButtonView from "./selectionButton.svelte";
  import { stateCoordinates } from "../../lib/data/stores";

  const { getSelect, getCells, getTable } = getContext("show");
  const dispatch = createEventbusDispatcher(); // createEventDispatcher();

  export let borderCover;
  export let select;
  export let selectSpace = { ...selSpace };
  export let selectCellCoords = { ...selCell };

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
    selectSpace = { ...selSpace }
    dispatch('updateSpace', {selectSpace, selCell});
  })

  function onInit(xEl,yEl) {
    setXparams(xEl);
    setYparams(yEl);
  }

  function setXparams(element) {
    selCellLeft = element.offsetLeft;
    selCellWidth = element.offsetWidth;

    selLeft = element.offsetLeft;
    selWidth = element.offsetWidth;
  }

  function setYparams(element) {
    selCellTop = element.offsetTop;
    selCellHeight = element.offsetHeight;

    selTop = element.offsetTop;
    selHeight = element.offsetHeight;
  }

  const onLoad = async () => {
    var shiftX = 0;
    var shiftY = 0;

    setTimeout(() => {
      let cells = getCells();

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

        // select = [[], []]; // Array(2).fill(Array(2)); // first last
        let xCursor = cells[0][Symbol.iterator]();
        let yCursor = cells[Symbol.iterator]();
        let first;

        onInit(cells[0][0],rows[1]);

        (async() => {
          for await (const ev of getSelect()) {
            let xEl = xCursor.next();
            let yEl = yCursor.next();

            if((ev.value && ev.value.type === "mousedown") || ev.type === "mousedown") {
              dispatch('nullDelta', { coords: [0,0] });
              let i = 0;

              for (let xEl of cells[0]) {
                if(ev.pageX > xEl.offsetLeft && ev.pageX < xEl.offsetLeft + xEl.offsetWidth) {
                  select[0][0] = i;
                  select[1][0] = i;
                  setXparams(xEl);
                }
                i++;
              }
            }
            //y
            if((ev.value && ev.value.type === "mousedown") || ev.type === "mousedown") {
              let i = 0;
              for (const yEl of rows) {
                if(ev.pageY > yEl.offsetTop + offsetTop && ev.pageY < yEl.offsetTop + offsetTop + yEl.offsetHeight) {
                  select[0][1] = i;
                  select[1][1] = i;
                  dispatch('selectCell', { select });
                  setYparams(yEl);
                }
                i++
              }
            }

            if(select[0][0] !== null && select[0][0] !== undefined &&
              select[0][1] !== null && select[0][1] !== undefined &&  ev.type === "mousemove") {

              let firstX = cells[0][select[0][0]];
              let firstY = rows[select[0][1]]
              selWidth = firstX.offsetWidth;
              selHeight = firstY.offsetHeight;

              if(ev.pageX > firstX.offsetLeft) {
                for(let i = select[0][0] ; i < cells[0].length; i++ ) {
                  xEl = cells[0][i];
                   selLeft = firstX.offsetLeft;

                  if(ev.pageX > xEl.offsetLeft && ev.pageX > firstX.offsetLeft + selWidth) {
                    selWidth += xEl.offsetWidth;
                    select[1][0] = i+1;
                  }
                }
              } else {
                for(let i = select[0][0] ; i >=0 ; i-- ) {
                  xEl = cells[0][i];
                  if(ev.pageX < xEl.offsetLeft && ev.pageX < firstX.offsetLeft +  firstX.offsetWidth - selWidth) {
                    selWidth += xEl.offsetWidth;
                    selLeft = firstX.offsetLeft +  firstX.offsetWidth - selWidth;
                    select[1][0] = i-1;
                  }
                }
              }
              if(ev.pageY > firstY.offsetTop + offsetTop ) {
                for(let i = select[0][1] + 1; i < rows.length -1; i++ ) {
                  yEl = rows[i];
                  selTop = firstY.offsetTop ;

                  if(ev.pageY > yEl.offsetTop + offsetTop && ev.pageY > firstY.offsetTop + offsetTop + selHeight) {
                    selHeight += yEl.offsetHeight;
                    select[1][1] = i;
                  }
                }
              } else {
                for(let i = select[0][1]-1; i >= 0; i-- ) {
                  yEl = rows[i];

                  if(ev.pageY < yEl.offsetTop + offsetTop + yEl.offsetHeight &&
                    ev.pageY < firstY.offsetTop + offsetTop + firstY.offsetHeight - selHeight) {

                    selHeight += yEl.offsetHeight;
                    selTop = firstY.offsetTop  + firstY.offsetHeight - selHeight;
                    select[1][1] = i;

                    if (ev.pageX > firstX.offsetLeft) {
                    } else {
                      selLeft = firstX.offsetLeft +  firstX.offsetWidth - selWidth;
                      select[1][1] = i;
                    }
                  }
                }
              }
            }
          }
          })();
        }
      },500)
  }

  onMount(onLoad);
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
