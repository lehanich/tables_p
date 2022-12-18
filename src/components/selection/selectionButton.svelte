<script lang="ts">
  import { onMount, getContext, afterUpdate } from 'svelte';

  let selSpace = {...$$props.selSpace};
  let moveButton: HTMLDivElement;

  export let borderCover;

  afterUpdate(() => {
    console.log($$props)
    selSpace = {...$$props.selSpace};
  });

</script>

<template lang="pug">
  div(bind:this='{moveButton}' style="position: absolute; border-width: 0px; padding: 0px; width: 8px; height: 8px; top: {selSpace.top+selSpace.height - 4}px; left: {selSpace.left+selSpace.width - 3}px;")
    div.autofill-handle.autofill-handle-ltr
    div.autofill-cover(style="top: 0px; left: 0px;")
</template>

<style lang="scss">
  .autofill-handle-ltr {
    border-width: 1px 0 0 1px;
  }

  .autofill-handle {
    background-color: #1a73e8;
    border: 1px solid white;
    height: 6px;
    margin-top: 1px;
    position: absolute;
    width: 6px;
    z-index: 8;
  }

  .autofill-cover {
    position: absolute;
    cursor: crosshair;
    width: 8px;
    height: 8px;
    z-index: 9;
  }
</style>