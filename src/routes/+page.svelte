<script>
  import { onMount } from 'svelte';
    // export let name;
  import Header from "../components/header/index.svelte";
  import Toolbar from "../components/toolbar/index.svelte";
  import Formula from "../components/formula/index.svelte";
  import Table from "../components/table/index.svelte";

  import {repeat, filter, seq, once, any, on, every, onlyEvent } from "../lib/eventIter.js";
  const loadWorker = async () => {
    var ball = document.getElementById('my-box');

    (async () => {
      const dnd = 
        repeat(() => 
          filter(
            seq(
              once(ball, 'mousedown'),
              every(
                any(
                  on(document.body, 'mousemove'),
                  on(ball, 'mouseup')
                ),
                onlyEvent('mousemove')
              )
            ),
            onlyEvent('mousemove')
          )
        );
   
      var shiftX = 0;
      var shiftY = 0;

      for await (const ev of dnd) {
        console.log(ev)
        const { top, left } = getCoords(ball);
        // var shiftX = ev.pageX - top;
        // var shiftY = ev.pageY - left;
        
       ball.style.left = ev.pageX - shiftX + 'px';
        ball.style.top = ev.pageY - shiftY + 'px';

      }

    })()
   

    function clear(e) {
      console.log("!!!", e)
      e = null
    }

    ball.ondragstart = function() {
      return false;
    };

    function getCoords(elem) {   // кроме IE8-
      var box = elem.getBoundingClientRect();
      return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
      };
    }

    var cell = document.getElementsByClassName('cell');
    var table = document.getElementsByClassName('table')[0];
    console.log(cell);
    console.log(table);
    (async () => {
      const show = 
        repeat(() => 
          filter(
            seq(
              once(table, 'mousedown'),
              every(
                any(
                  on(table, 'mousemove'),
                  on(table, 'mouseup')
                ),
                onlyEvent('mousemove')
              )
            ),
            onlyEvent('mousemove')
          )
        );
   
      var shiftX = 0;
      var shiftY = 0;

      for await (const ev of show) {
        console.log(ev.currentTarget)
        // ev.currentTarget.
        // const { top, left } = getCoords(ball);
        // var shiftX = ev.pageX - top;
        // var shiftY = ev.pageY - left;
        
      //  ball.style.left = ev.pageX - shiftX + 'px';
      //   ball.style.top = ev.pageY - shiftY + 'px';

      }

    })()

  };


  // const loadWorker = async () => {
  //   const SyncWorker = await import('$lib/my.js?worker');
  //   syncWorker = new SyncWorker.default();

  //   syncWorker.postMessage({});
  // };

  onMount(loadWorker);
</script>


<template lang="pug">
  Header
  Toolbar
  Formula
  Table
  div#my-box BALL
</template>

<style lang="scss" module>
  // @import "../layout/styles/index.scss";

  #my-box {
    position: absolute;
    z-index: 100;

  }
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