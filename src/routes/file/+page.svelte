<script lang="ts">
  import { onMount } from 'svelte';

  let syncWorker: Worker | undefined = undefined;

  const onWorkerMessage = () => {
      console.log('Cool it works out 😃');
  };

  const loadWorker = async () => {
    const SyncWorker = await import('$lib/my.js?worker');
    syncWorker = new SyncWorker.default();

    syncWorker.onmessage = onWorkerMessage;

    syncWorker.postMessage({});
  };


  // const loadWorker = async () => {
  //   const SyncWorker = await import('$lib/my.js?worker');
  //   syncWorker = new SyncWorker.default();

  //   syncWorker.postMessage({});
  // };

  onMount(loadWorker);
</script>

<h1>Web worker demo</h1>