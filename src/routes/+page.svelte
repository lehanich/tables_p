<h1>Welcome to SvelteKit</h1>
<p></p>
<template lang="pug">
  div Posts 
</template>

<style lang="scss">
  $color: red;

  h1 {
    color: $color;
  }

  div {
    background: green;

    > p {
      color: #fff;
    }
  }
</style>