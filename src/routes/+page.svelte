<script>
  export const prerender = true;
  import { onMount } from 'svelte';
  import Header from "../components/header/index.svelte";
  import Toolbar from "../components/toolbar/index.svelte";
  import Formula from "../components/formula/index.svelte";
  import Table from "../components/table/index.svelte";
  import Bottom from "../components/bottom/index.svelte";

  const loadWorker = async () => {
  //   const SyncWorker = await import('$lib/my.js?worker');
  //   syncWorker = new SyncWorker.default();

  //   syncWorker.postMessage({});
  };

  onMount(loadWorker);
</script>


<template lang="pug">
  Header
  Toolbar
  Formula
  Table
  Bottom
</template>

<style lang="scss" module>

</style>