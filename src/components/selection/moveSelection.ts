  import { onMount, getContext, afterUpdate } from 'svelte';
  import {repeat, filter, seq, once, any, on, every, onlyEvent, onlyEvents } from "../../lib/eventIter.js";

  let activeSide: HTMLDivElement

  const { getTable, getCells } = getContext("show");

  let borderCover = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    cursor: "-webkit-grab" // -webkit-grabbing
  }

  borderCoverStyle = `
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
      ...$$props.borderCover,
      top: $$props.borderCover?.top + getTable().offsetTop,
    };
  });

  const onLoad = async () => {
        console.log(activeSide)
        // var activeSide = document.getElementById('test');
      const activeSideActions = repeat(() => 
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
            onlyEvents('mousedown', 'mousemove', 'mouseup')
          )
      );

      activeSide.ondragstart = function() {
        return false;
      };

      setTimeout(() => {
        const cells = getCells();

        const offsetTop = getTable().offsetTop;
        const offsetLeft = getTable().offsetLeft;

        const rows = [];
        let i = 0;
        for (const child of getTable().children) {
          if(child.classList.contains("row")) {
            rows[i] = child;
            i++;
          }
        }

        const select = Array(2).fill(Array(2));
        const xCursor = cells[0][Symbol.iterator]();
        const yCursor = cells[Symbol.iterator]();
      
        (async() => {
          for await (const ev of activeSideActions) {
            console.log(ev)

            let xEl = xCursor.next();
            const yEl = yCursor.next();

            let pageY
            let pageX
            if (ev.type === "mousedown") {
              pageY = ev.pageY;
              pageX = ev.pageX;
              let i = 0;
              for (const xEl of cells[0]) {
                // console.log(ev.pageX , xEl.offsetLeft , ev.pageX , xEl.offsetLeft + xEl.offsetWidth)
                if(ev.pageX > xEl.offsetLeft && ev.pageX < xEl.offsetLeft + xEl.offsetWidth) {
                  //stop
                  console.dir( xEl)
                  select[0][0] = i
                }
                i++
              }

              i = 0;
              for (const yEl of rows) {
                // console.log("y", yEl.offsetTop + offsetTop, yEl.offsetHeight, yEl.clientHeight)
                if(ev.pageY > yEl.offsetTop + offsetTop && ev.pageY < yEl.offsetTop + offsetTop + yEl.offsetHeight) {
                  //stop
                  console.dir( yEl)
                  // console.dir(rows)
                  select[0][1] = i
                }
                i++
              }
            }
            
            if (select[0][0] && select[0][1] && ev.type === "mousemove") {
              const firstX = cells[0][select[0][0]];
              const firstY = rows[select[0][1]]

              // borderCover.left = ev.
              // borderCover.top
              
              if(ev.pageX > firstX.offsetLeft) {
                for(let i = select[0][0] ; i < cells[0].length; i++ ) {
                  xEl = cells[0][i];
                  // selLeft = firstX.offsetLeft
                  // borderCover.left = borderCover.left + xEl.offsetLeft
                  //  console.log("selLeft", xEl)
                  console.log(ev.pageX , xEl.offsetLeft + borderCover.left, firstX.offsetLeft + firstX.offsetWidth)
                  if(ev.pageX > xEl.offsetLeft + borderCover.left) {
                    // borderCover.left = borderCover.left + firstX.offsetLeft
                  }
                  // console.log("selLeft", selLeft);
                }
              } else if (ev.pageX < firstX.offsetLeft) {
                for(let i = select[0][0] ; i >=0 ; i-- ) {
                  xEl = cells[0][i];
                  console.log(ev.pageX , xEl.offsetLeft + borderCover.left, firstX.offsetLeft + firstX.offsetWidth)
                  if(ev.pageX < xEl.offsetLeft) {
                    // selWidth += xEl.offsetWidth;

                    // borderCover.left = borderCover.left - xEl.offsetLeft
                    // console.log("selLeft", selLeft);
                  }
                  // console.log("selLeft", selLeft);
                }
              }

              // if(ev.pageY > firstY.offsetTop + offsetTop ) {
              // } 
              // else {

              // }
            }
          }
        })()
      },500);
  }

  onMount(onLoad);