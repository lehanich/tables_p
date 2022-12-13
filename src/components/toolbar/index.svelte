<script>
    import Button from "../ui/i-button/index.svelte";
</script>
<template lang="pug">
  div.toolbar
    Button.button format_align_left
    Button.button format_align_center
    Button.button format_align_right
    Button.button format_bold
    Button.button format_italic
    Button.button format_underline
</template>

<style lang="scss" module>
  @import "../../layout/styles/variables.scss";
  @import "./toolbar.scss";
</style>