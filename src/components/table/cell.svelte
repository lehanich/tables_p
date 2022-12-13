<template lang="pug">
  div.cell(contenteditable data-column="{$$props.index}")
    slot
</template>

<style lang="scss">
  @import "./cell.scss";
</style>