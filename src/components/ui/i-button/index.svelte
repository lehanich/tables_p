<!--language=Pug-->
<template lang="pug">
  div.button(on:click="{$$props.click}")
    i.materialIcons
      slot
</template>

<style lang="scss" module>
  @import "./i-button.scss";
</style>