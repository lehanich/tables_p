<script lang="ts">
  import { onMount, getContext } from 'svelte';
	import { select_option } from 'svelte/internal';
  import {repeat, filter, seq, once, any, on, every, onlyEvent, onlyEvents } from "../../lib/eventIter.js";

  let selectionArea: HTMLDivElement;

  $: style = `
    position: absolute;
    background-color: rgb(14, 101, 235);
    opacity: 0.1;
    top: ${$$props.selSpace.top}px;
    left: ${$$props.selSpace.left}px;
    width: ${$$props.selSpace.width}px;
    height: ${$$props.selSpace.height}px;
  `;

</script>

<template lang="pug">
  div.selection(bind:this='{selectionArea}' style="{style}")
    slot
</template>

<style lang="scss" module>
  .selection {
    position: absolute;
    background-color: rgb(14, 101, 235);
    opacity: 0.1;
    top: 252px;
    left: 717px;
    width: 202px;
    height: 126px;
  }
</style>
