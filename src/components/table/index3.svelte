<script lang="ts">
  import { afterUpdate } from 'svelte';
  import Cell from "./cell.svelte";

  const CODES = {
    A: 65,
    Z: 90,
  };

  function toChar(_: any, i:number) {
    return String.fromCharCode(CODES.A + i);
  }

  const colsCount = CODES.Z - CODES.A + 1;
  const rows2 = new Array(20+1);
  const cols2 = new Array(colsCount).fill('').map(toChar);
  const cells = new Array(20+1).fill(new Array(colsCount)); 

	function addRow() {
		data = [...data, [...newRow]]
		newRow = columns
	}
	function deleteRow(rowToBeDeleted) {
		data = data.filter(row => row != rowToBeDeleted)
	}
	let columns = ["Name", "Email", "Phone Number"]
	let data = [
    ["John", "john@example.com", "(353) 01 222 3333"],
    ["Sarah", "sarah@gmail.com", "(01) 22 888 4444"],
    ["Afshin", "afshin@mail.com", "(353) 22 87 8356"]
  ]
  let rows = [0,1,2];
  let cols = [0,1,2]
	let newRow = [...columns];
  afterUpdate(() => {
    console.log(cells)
  });



// <table class="table">
// 	<tr>
// 		{#each columns as column}
// 			<th>{column}</th>
// 		{/each}
// 	</tr>
	
//   {#each cols as cell,index2 (3000+index2)}
//   <Cell
    
//   >
//   </Cell>
//   {/each}
// 	<!-- {#each data as row,index1} -->
//   {#each rows as row,index1 (1000+index1)}
// 		<tr>
// 			<!-- {#each row as cell,index2} -->
//       {#each cols as cell,index2 (1000+index2)}
// 			<!-- <td contenteditable="true" bind:innerHTML={cell} /> bind:cell='{cells[index1][index2]}' -->

//         <Cell
//           bind:html='{data[index1][index2]}'
//           bind:cell='{cells[index1][index2]}'
//         >
//         </Cell>
// 			{/each}
// 			<button on:click={() => deleteRow(row)}>X</button>
// 		</tr>
// 	{/each}
// 	<tr style="color: grey">
// 		{#each newRow as column}
// 			<td contenteditable="true" bind:innerHTML={column} />
// 		{/each}
// 		<button on:click={addRow}>add</button>
// 	</tr>
// 	<pre style="background: #eee">{JSON.stringify(data, null, 2)}</pre>
// </table>
</script>

<template lang="pug">
  table.table
    tr
      +each('columns as column')
        th {column}
    +each('cols as cell,index2 (1000+index2)')
      Cell
    +each('rows as row,index1 (2000+index1)')
      tr
        +each('cols as cell,index2 (3000+index2)')
          Cell(
            bind:html='{data[index1][index2]}'
            bind:cell='{cells[index1][index2]}'
          )
      button(on:click!='{() => deleteRow(row)}') del
    tr(style="color: grey")
      +each('newRow as column')
        td(contenteditable="true" bind:innerHTML='{column}')
      button(on:click='{addRow}') add
    pre(style="background: #eee") {JSON.stringify(data, null, 2)}
</template>

<style>
  .table {
  position: absolute;
  left: 0;
  right: 0;
  top: 98px;
  overflow-x: auto;
  padding-bottom: 2px;
}
	tr td:focus {
		background: #eee;
	}
</style>
