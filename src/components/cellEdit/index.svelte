<!-- <svelte:options accessors immutable/> -->

<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';
  import { stateTableMatrix, stateTableStyles, inputStore, stateCoordinates } from "../../lib/data/stores";

  export let cell: HTMLDivElement;
  export let html: string = "";

  const { value, row, column } = $$props
  let selection;

  function handleSelect(e) {
    console.log("999", e)
  }

  afterUpdate(() => {
    // html = html ?? value;

    $stateTableMatrix.update( $stateCoordinates.select[0][0], $stateCoordinates.select[0][1]-1).element = "<span style='font-weight:bold;'>"+$inputStore+"</span>";
    $stateTableMatrix = $stateTableMatrix
    console.log($inputStore)
    console.log($stateTableMatrix)
    console.log("999 selection ", selection)
    console.log("999 selection 2 ", document.getSelection(), document.getSelection()?.getRangeAt(0), document.getSelection()?.toString())
    console.dir(cell)

  });

  const onLoad = async () => {
    console.log($stateCoordinates.select[0])
    cell.focus();
    cell.addEventListener(`selectionchange`, () => {
      selection = document.getSelection();
    });
  }

  onMount(onLoad);
  // span.cell-content(
  //     style:font-weight='{$stateTableStyles.getElement($stateCoordinates.select[0][1]-1, $stateCoordinates.select[0][0]).fontWeight}'
  //   )
</script>

<template lang="pug">
  div.cellEdit(
    contenteditable
    test="textbox"
    role="combobox"
    data-row="{row}"
    data-column="{column}"
    bind:innerHTML='{$inputStore}'
    bind:this='{cell}'
    on:selectionchange='{handleSelect}'
  )
    slot
</template>

<style lang="scss">
  @import "./cellEdit.scss";


</style>
