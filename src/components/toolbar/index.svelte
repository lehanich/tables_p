<script>
  import Button from "../ui/i-button/index.svelte";
  import {importCSV} from "./importCSV.ts";

  let files;

  let fetchStatus = 'INITIAL';

    const handleImportCSV = () => {
      console.log("CLICK");
      if (files) {
        fetchStatus = 'PENDING';
        try {
          importCSV(files);
          fetchStatus = 'FULFILLED';
        } catch {
          fetchStatus = 'REJECTED'
        }
      }
    }

</script>

<!--language=Pug-->
<template lang="pug">
  div.toolbar
    Button.button format_align_left
    Button.button format_align_center
    Button.button format_align_right
    Button.button format_bold
    Button.button format_italic
    Button.button format_underline
    Button.button(click="{handleImportCSV}") upload_file
    input(type="file" bind:files)
</template>
<style lang="scss" module>
  @import "../../layout/styles/variables.scss";
  @import "./toolbar.scss";
</style>