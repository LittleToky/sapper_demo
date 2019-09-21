<script context="module">
  export async function preload({ params, query }) {
    const time = new Date().getTime();
    return { params, query, time }
  }  
</script>

<script>
  import { someData, pathData } from '../../../../stores/menuStore';
  
  export let time;
  export let params;
  export let query;
  console.log('set pathData', params)
  //pathData.set(params);
  pathData.update($pathData => $pathData = params);
  
  console.log(`It's a subsubcat (${time}). set pathData`, params)
  
  function changeStore(e) {
    someData.update($someData => $someData = $someData + 1);
  }
  
  export let segment;
</script>

<div class="cat">
  <div>!!! SUBSUBCAT {$someData}!!!!</div>
  <div>({time}) params:</div>
  <div class="yellow">{Object.keys(params).map(key => $pathData[key])}</div>
  <div>({time}) $pathData:</div>
  <div class="yellow">{Object.keys($pathData).map(key => $pathData[key])}</div>
  <div class="green" on:click={changeStore}>button</div>
  <a href="/">to index</a>
</div>