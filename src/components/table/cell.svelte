<!-- <svelte:options accessors immutable/> -->
<script lang="ts">
  export let cell: HTMLDivElement;
  export let html: string = "";

  const { value, row, column } = $$props

  export let width;
  export let display;
  export let height;

  $: showDisplay = display === "block" ? 1 : 0;
  $: showWidth = width ? width : "120px";
  $: showHeight = height ? height : "100%";

</script>

<template lang="pug">
  div.cell(
    data-row="{row}"
    data-column="{column}"
    bind:this='{cell}'
    style:z-index='{showDisplay}'
    style:width='{showWidth}'
    style:height='{showHeight}'
    style:background-color="#fff"
  )
    slot
</template>

<style lang="scss">
  @import "./cell.scss";
</style>