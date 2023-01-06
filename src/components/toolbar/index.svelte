<script>
  import Button from "../ui/i-button/index.svelte";
  import {importCSV} from "./importCSV.ts";
  import { stateTableMatrix, stateCoordinates, inputStore } from "../../lib/data/stores";
  //stateTableStyles
	import { normalizePath } from "vite";

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

  function handleBold(e) {
    console.log(e);
    // console.log($stateTableStyles.print())
    // $stateCoordinates.select[0][0]
    // $stateCoordinates.select[0][1]
    // let obj = $stateTableStyles.getElement(
    //       $stateCoordinates.select[0][0],
    //       $stateCoordinates.select[0][1]-1);

    // obj.fontWeight = obj.fontWeight !== "bold" ? "bold" : "normal";
    // $stateTableStyles.setElement(
    //   $stateCoordinates.select[0][0],
    //   $stateCoordinates.select[0][1]-1,
    //   obj
    // )
    // $stateTableStyles = $stateTableStyles

    // console.log($stateTableStyles.getElement(
    //       $stateCoordinates.select[0][0],
    //       $stateCoordinates.select[0][1]-1))
  }

</script>

<!--language=Pug-->
<template lang="pug">
  div.toolbar
    Button.button format_align_left
    Button.button format_align_center
    Button.button format_align_right
    Button.button(
      click='{handleBold}'
    ) format_bold
    Button.button format_italic
    Button.button format_underline
    Button.button(click="{handleImportCSV}") upload_file
    input(type="file" bind:files)
</template>

<style lang="scss" module>
  @import "../../layout/styles/variables.scss";
  @import "./toolbar.scss";
</style>
