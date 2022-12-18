<script lang="ts">
  import { onMount, getContext, afterUpdate } from 'svelte';

  let selCell = {...$$props.selCell};
  let selectionCell;
  
  export let borderCover;

  afterUpdate(() => {
    console.log($$props)
    selCell = {...$$props.selCell};
  });

  function handleMouseOverCell(e) {
		// colour = 'green';
    console.log("mouse over",e)
    borderCover = {
      top: selectionCell.offsetTop + e.target.offsetTop,
      left: selectionCell.offsetLeft + e.target.offsetLeft,
      height: e.target.offsetHeight,
      width: e.target.offsetWidth,
    }
	}
	function handleMouseOutCell(e) {
		// colour = 'red';
    console.log("mouse out")
	}
</script>

<template lang="pug">
  div.cellSelection(bind:this='{selectionCell}'
    on:mouseover='{handleMouseOverCell}' on:mouseout='{handleMouseOutCell}'
    style="position: absolute; border-width: 0px; padding: 0px; width: 0px; height: 0px; top: {selCell.top}px; left: {selCell.left}px;")
    div.range-border.active-cell-border(style="border-top-width: 2px; user-select: none; top: -1px; left: -1px; width: {selCell.width}px;")
    div.range-border.active-cell-border(style="border-bottom-width: 2px; user-select: none; top: {selCell.height-2}px; left: -1px; width: {selCell.width}px;")
    div.range-border.active-cell-border(style="border-right-width: 2px; user-select: none; top: -1px; left: {selCell.width-2}px; height: {selCell.height}px;")
    div.range-border.active-cell-border(style="border-left-width: 2px; user-select: none; top: -1px; left: -1px; height: {selCell.height}px;")
</template>

<style lang="scss">
  .active-cell-border {
    border-color: #1a73e8;
    line-height: 1px;
    z-index: 7;
  }
</style>