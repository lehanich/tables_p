<script>
  import { importCSV } from "./importCSV.ts";

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

<h1>Welcome to SvelteKit</h1>

{#if fetchStatus === 'FULFILLED'}
<h2>Success</h2>
{/if}
{#if fetchStatus === 'REJECTED'}
  <h2>Error</h2>
{/if}
<input type="file" bind:files>
<template lang="pug">
  if fetchStatus === 'FULFILLED'
      h2 Success
  else if fetchStatus === 'REJECTED'
      h2 Error
  else
      h2 1
  div Posts 
</template>

<style lang="scss">
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