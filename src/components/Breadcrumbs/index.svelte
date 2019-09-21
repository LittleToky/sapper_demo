<script>
  import dataHelpers from '../../helpers/dataHelpers';
  import { pathData, someData } from '../../stores/menuStore';
  // const crumbs = dataHelpers.formCrumbs($pathData);
</script>

<style src="./style/index.css">
</style>

<breadcrumbs class="breadcrumbs">
  <div>!!!Breadcrumbs {$someData}!!!</div>
  <div>$pathData:</div>
  <div class="yellow">{Object.keys($pathData).map(t => $pathData[t])}</div>
  
  <div>
    <div class="pink">
      Link 1:
      <div>
        <a rel="prefetch" href="catalog/miebiel/miaghkaia-miebiel/divany">мягкая мебель / диваны</a>
      </div>
    </div>
    <div class="pink">
      Link 2:
      <div>
        <a rel="prefetch" href="catalog/miebiel/miaghkaia-miebiel/kriesla">мягкая мебель / кресла</a>
      </div>
    </div>
    <div class="pink">
      Link 3:
      <div>
        <a rel="prefetch" href="catalog/miebiel/miaghkaia-miebiel">мягкая мебель</a>
      </div>
    </div>
    <div class="pink">
      Link 4:
      <div>
        <a rel="prefetch" href="catalog/miebiel/krovati-i-matrasy">кровати и матрасы</a>
      </div>
    </div>
  </div>
  
  {#each dataHelpers.formCrumbs($pathData) as crumb}
    <div class="crumb">
      {#if crumb.permalink}
        <a href={crumb.permalink}>{crumb.name}</a>
      {:else}
        {crumb.name}
      {/if}
    </div>
  {/each}
</breadcrumbs>
