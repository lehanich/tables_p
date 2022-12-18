<script lang="ts">
  export let cell: HTMLDivElement;
</script>

<template lang="pug">
  div.cell(contenteditable data-row="{$$props.row}" data-column="{$$props.column}" bind:this='{cell}')
    slot
</template>

<style lang="scss">
  @import "./cell.scss";
</style>