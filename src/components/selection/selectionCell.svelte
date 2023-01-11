<script lang="ts">
  import { onMount, getContext, afterUpdate } from 'svelte';

  let selCell = {...$$props.selCell};
  let selectionCell: HTMLDivElement;
  
  export let borderCover;

  afterUpdate(() => {
    // console.log("444 8",$$props, borderCover)
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
  div.range-border.cellSelection(
    bind:this='{selectionCell}'
    on:mouseover='{handleMouseOverCell}'
    on:mouseout='{handleMouseOutCell}'
    style="top: {selCell.top}px; left: {selCell.left}px;"
  )
    div.range-border.active-cell-border.top(style="width: {selCell.width}px;")
    div.range-border.active-cell-border.bottom(style="top: {selCell.height-2}px; width: {selCell.width}px;")
    div.range-border.active-cell-border.left(style="left: {selCell.width-2}px; height: {selCell.height}px;")
    div.range-border.active-cell-border.right(style="height: {selCell.height}px;")
</template>

<style lang="scss" module>
  .cellSelection {
    position: absolute;
    border-width: 0px;
    padding: 0px;
    width: 0px;
    height: 0px;
  }
  .range-border {
    position: absolute;
    border-width: 0;
    border-style: solid;
    padding: 0;
  }
  .active-cell-border {
    border-color: #1a73e8;
    line-height: 1px;
    user-select: none;
    z-index: 7;
  }
  .top {
    border-top-width: 2px;
    top: -1px;
    left: -1px;
  }
  .bottom {
    border-bottom-width: 2px;
    left: -1px;
  }
  .left {
    border-right-width: 2px;
    top: -1px; 
  }
  .right {
    border-left-width: 2px;
    top: -1px;
    left: -1px; 
  }
</style>