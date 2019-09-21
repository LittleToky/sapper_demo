<script context="module">
  export async function preload({ params, query }) {
    return { params, query }
  }  
</script>

<script>
  import { someData } from '../../stores/menuStore';
  
  function changeStore(e) {
    someData.update($someData => $someData = $someData + 1);
  }
  
  export let params
</script>

<div>{$someData}</div>
<div on:click={changeStore}>button</div>
<a href="/">to index</a>