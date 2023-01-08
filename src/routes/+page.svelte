<script>
  export const prerender = true;
  import { onMount } from 'svelte';
  import Eventbus from '../components/base/EventBus.svelte';
  import Header from "../components/header/index.svelte";
  import Toolbar from "../components/toolbar/index.svelte";
  import Formula from "../components/formula/index.svelte";
  import Table from "../components/table/index.svelte";
  import Bottom from "../components/bottom/index.svelte";

  let showEditCell;
  const handleShowEditCell = (e) => {
    console.log("777",e)
    showEditCell = true;
    console.log("777 444", showEditCell)
    // setTimeout(() => {
    //   showEditCell = false
    // }, 500);
  }

  const onLoad = async () => {
  //   const SyncWorker = await import('$lib/my.js?worker');
  //   syncWorker = new SyncWorker.default();

  //   syncWorker.postMessage({});
  };

  onMount(onLoad);
</script>


<template lang="pug">
  Eventbus(
    on:showEditCell='{handleShowEditCell}'
  )
    Header
    Toolbar
    Formula
    Table(
      bind:showEditFormula='{showEditCell}'
    )
    Bottom
</template>

<style lang="scss" module>

</style>