<script>
    // export let name;
  import { importCSV } from "./importCSV.ts";
  import Header from "../components/header/index.svelte";
  import Toolbar from "../components/toolbar/index.svelte";
  import Formula from "../components/formula/index.svelte";
  let files;
  let fetchStatus = 'INITIAL';

  $: if (files) {
    fetchStatus = 'PENDING';
    try {
      importCSV(files);
      fetchStatus = 'FULFILLED';
    } catch {
      fetchStatus = 'REJECTED'
    }
  }
</script>


<template lang="pug">
  Header
  Toolbar
  Formula
  if fetchStatus === 'FULFILLED'
      h2 Success
  else if fetchStatus === 'REJECTED'
      h2 Error
  else
      h2 1
  div Posts 
</template>

<style lang="scss" module>
  @import '../layout/styles/index.scss';

  $color: red;

  h1 {
    color: $color;
  }

  div {
    background: green;

    // > p {
    //   color: #fff;
    // }
  }
</style>