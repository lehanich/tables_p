<!-- <svelte:options accessors immutable/> -->
<script lang="ts">
  import { afterUpdate } from 'svelte';

  export let cell: HTMLDivElement;
  export let html: string = "";

  const { value, row, column } = $$props
</script>

<template lang="pug">
  div.cell(
    data-row="{row}"
    data-column="{column}"
    bind:this='{cell}'
  )
    slot
</template>

<style lang="scss">
  @import "./cell.scss";
</style>