<script>
  import RowResize from "../ui/row-resize/index.svelte"
</script>

<template lang="pug">
  div.row(data-type="resizable")
    div.row__info {$$props.index + 1}
      RowResize.row__resize
    div.row__data
      slot
      
  
</template>

<style lang="scss">
  @import "./row.scss";
</style>