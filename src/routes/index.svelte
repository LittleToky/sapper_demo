

<script>
  import { someData } from '../stores/menuStore';
  
  function changeStore(e) {
    someData.update($someData => $someData = $someData + 1);
  }
</script>

<div>{$someData}</div>

<div on:click={changeStore}>button</div>