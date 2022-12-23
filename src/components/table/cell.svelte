<script lang="ts">
  import { afterUpdate } from 'svelte';

  export let cell: HTMLDivElement;
  export let html: string = "";

  const { value, row, column } = $$props

  afterUpdate(() => {
    html = value ?? html;
  });
</script>

<template lang="pug">
  div.cell(contenteditable data-row="{row}" data-column="{column}" bind:innerHTML='{html}' bind:this='{cell}')
    slot
</template>

<style lang="scss">
  @import "./cell.scss";
</style>