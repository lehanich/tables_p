<script>
    // export let name;
  import Header from "../components/header/index.svelte";
  import Toolbar from "../components/toolbar/index.svelte";
  import Formula from "../components/formula/index.svelte";
  import Table from "../components/table/index.svelte";
</script>


<template lang="pug">
  Header
  Toolbar
  Formula
  Table
</template>

<style lang="scss" module>
  @import "../layout/styles/index.scss";

  // $color: red;

  // h1 {
  //   color: $color;
  // }

  // div {
  //   background: green;

  //   // > p {
  //   //   color: #fff;
  //   // }
  // }
</style>