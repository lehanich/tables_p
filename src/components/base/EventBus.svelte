<script>
  import {current_component} from 'svelte/internal';
  import {initEventbus} from '../../lib/eventBus';
  console.log("event bus component",current_component);
  console.dir(current_component)
  initEventbus(current_component);
</script>

<slot/>
