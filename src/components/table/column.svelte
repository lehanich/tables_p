<script>
  import ColResize from "../ui/col-resize/index.svelte";
</script>

<template lang="pug">
  div.column(data-type="resizable")
    slot
    ColResize.column__resize
</template>

<style lang="scss">
  @import "./column.scss";
</style>