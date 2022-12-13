<script lang="ts">
  import Row from "./row.svelte";
  import Column from "./column.svelte";
  import Cell from "./cell.svelte";

  const CODES = {
    A: 65,
    Z: 90,
  };

  function toChar(_: any, i:number) {
    return String.fromCharCode(CODES.A + i);
  }

  const colsCount = CODES.Z - CODES.A + 1;
  const rows = new Array(20);
  const cols = new Array(colsCount).fill('').map(toChar); //.map(toColumn).join('');

</script>

<template lang="pug">
  div.table
    Row
      +each('cols as col')
        Column {col}
    +each('rows as row, index')
      Row(index="{index}")
        +each('cols as col')
          Cell(index="{col}")
  
</template>

<style lang="scss" module>
  @import "./table.scss";
</style>