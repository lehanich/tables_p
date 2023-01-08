<script lang="ts">
  import ColResize from "../ui/col-resize/index.svelte";
  export let cell: HTMLDivElement;
</script>

<template lang="pug">
  div.column(data-type="resizable" bind:this='{cell}')
    slot
    ColResize.column__resize
</template>

<style lang="scss">
  @import "./column.scss";
</style>