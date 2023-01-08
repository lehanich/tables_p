<svelte:options accessors={true}/>

<script lang="ts">
  import RowResize from "../ui/row-resize/index.svelte"
  export let row: HTMLDivElement;
</script>

<template lang="pug">
  div.row(data-type="resizable" data-row='{$$props.index+1}' bind:this='{row}')
    div.row__info {$$props.index + 1}
      RowResize.row__resize
    div.row__data
      slot
      
  
</template>

<style lang="scss">
  @import "./row.scss";
</style>