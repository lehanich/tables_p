<script lang="ts">
  import { onMount, setContext, afterUpdate, tick } from 'svelte';
  import { stateTableMatrix, stateCoordinates, inputStore } from "../../lib/data/stores";

  afterUpdate(() => {
    console.log($stateCoordinates)
    // $stateTable[$stateCoordinates.select[0][1]-1][$stateCoordinates.select[0][0]] = $inputStore
    $stateTableMatrix.update( $stateCoordinates.select[0][0], $stateCoordinates.select[0][1]-1).element = $inputStore
    $stateTableMatrix = $stateTableMatrix
    console.log($inputStore)
    // console.log($stateTable[$stateCoordinates.select[0][1]-1][$stateCoordinates.select[0][0]])
  })

  // $stateTable[$stateCoordinates.select[0][0]][$stateCoordinates.select[0][1]] = $inputStore

</script>

<template lang="pug">
  div.formula
    div.info
    div.input(
      contenteditable
      spellcheck="false"
      bind:innerHTML="{$inputStore}"
    )
</template>

<style lang="scss" module>
  @import "./formula.scss";
</style>