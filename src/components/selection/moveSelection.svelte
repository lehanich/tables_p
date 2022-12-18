<script lang="ts">
  import { onMount, getContext, afterUpdate } from 'svelte';
  import {repeat, filter, seq, once, any, on, every, onlyEvent, onlyEvents } from "../../lib/eventIter.js";

  let activeSide: HTMLDivElement

  let borderCover = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    cursor: "-webkit-grab" // -webkit-grabbing
  }
  $: borderCoverStyle = `
    cursor:  ${borderCover.cursor};
    left: ${borderCover.left}px;
    top:  ${borderCover.top}px;
    width:  ${borderCover.width}px;
    height:  ${borderCover.height}px;
  `

  afterUpdate(() => {
    console.log($$props)
    borderCover = {
      ...borderCover,
      ...$$props.borderCover
    };
  });

  const onLoad = async () => {
        console.log(activeSide)
        // var activeSide = document.getElementById('test');
        let activeSideActions = 
        repeat(() => 
          filter(
            seq(
              once(activeSide, 'mousedown'),
              every(
                any(
                  on(activeSide, 'mousemove'),
                  on(activeSide, 'mouseup')
                ),
                onlyEvent('mousemove')
              )
            ),
            onlyEvents('mousedown','mousemove')
          )
        );

        (async() => {for await (const ev of activeSideActions) {
            console.log(ev)

        }
        })()
      }

  onMount(onLoad);
</script>

<template lang="pug">
  div.selection-border-cover(bind:this='{activeSide}' style="{borderCoverStyle}" id="test")
</template>

<style lang="scss">
  .selection-border-cover {
    position: absolute;
    z-index: 7;
  }
</style>
