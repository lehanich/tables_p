<script>
  import {current_component} from 'svelte/internal';
  import {initEventbus} from '../../lib/eventBus';
  initEventbus(current_component);
</script>

<slot/>
