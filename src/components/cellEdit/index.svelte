<!-- <svelte:options accessors immutable/> -->

<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';
  import { stateTableMatrix, inputStore, stateCoordinates } from "../../lib/data/stores";

  export let cell: HTMLDivElement;
  export let html: string = "";

  const { value, row, column } = $$props

  afterUpdate(() => {
    // html = html ?? value;

    $stateTableMatrix.update( $stateCoordinates.select[0][0], $stateCoordinates.select[0][1]-1).element = $inputStore
    $stateTableMatrix = $stateTableMatrix
    console.log($inputStore)
    console.log($stateTableMatrix)

  });

  const onLoad = async () => {
    cell.focus();
  }

  onMount(onLoad);
</script>

<template lang="pug">
  div.cellEdit(
    contenteditable
    data-row="{row}"
    data-column="{column}"
    bind:innerHTML='{$inputStore}'
    bind:this='{cell}'

  )
    span
      slot
</template>

<style lang="scss">
  @import "./cellEdit.scss";


</style>
