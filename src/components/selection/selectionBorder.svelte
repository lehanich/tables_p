<script lang="ts">
  import { onMount, getContext, afterUpdate } from 'svelte';
  
  let selSpace = {...$$props.selSpace};
  let selectionBorder: HTMLDivElement;

  export let borderCover;

  afterUpdate(() => {
    selSpace = {...$$props.selSpace};
  });

  function handleMouseOverBorder(e) {
		// colour = 'green';
    console.log("mouse over",e)
    borderCover = {
      top: selectionBorder.offsetTop + e.target?.offsetTop,
      left: selectionBorder.offsetLeft + e.target?.offsetLeft,
      height: e.target?.offsetHeight,
      width: e.target?.offsetWidth,
    }
	}
	function handleMouseOutBorder(e: HTMLElementEventMap) {
		// colour = 'red';
    console.log("mouse out")
	}

</script>

<template lang="pug">
  div(bind:this='{selectionBorder}'
    on:mouseover='{handleMouseOverBorder}' on:mouseout='{handleMouseOutBorder}'
    style="position: absolute; border-width: 0px; padding: 0px; height: 0px; width: 0px; top: { selSpace.top}px; left: { selSpace.left}px;")
    div(class='{$$props.class}' class="selection-border" style="border-top-width: 1px; user-select: none; opacity: 1; top: -1px; left: -1px; width: {selSpace.width}px;")
    div(class='{$$props.class}' class="selection-border" style="border-bottom-width: 1px; user-select: none; opacity: 1; top: {selSpace.height-1}px; left: -1px; width: {selSpace.width}px;")
    div(class='{$$props.class}' class="selection-border" style="border-right-width: 1px; user-select: none; opacity: 1; top: -1px; left: {selSpace.width-1}px; height: {selSpace.height}px;")
    div(class='{$$props.class}' class="selection-border" style="border-left-width: 1px; user-select: none; opacity: 1; top: -1px; left: -1px; height: {selSpace.height}px;")
</template>

<style lang="scss">
  .selection-border {
    border-color: #1a73e8;
    line-height: 0;
    z-index: 7;
  }
</style>