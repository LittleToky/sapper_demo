<script context="module">
  import dataHelpers from '../helpers/dataHelpers';
  export async function preload(page, session) {
    const headers = {'X-Spree-Token': 'ed13666ddef7c8995aa58b4f65d679bb407af153035e45f4'};
    const baseURL = '//backend.store.rerooms.ru/api'
    
    // Запрос всех категорий
    const resCategories = await this.fetch(`${baseURL}/v1/taxonomies?q[name_not_cont]=old&set=nested`, {headers});
    let categories = await resCategories.json();
    categories = categories.taxonomies.map(cat => cat.root); 
    
    // Запрос списка комнат
    const resRooms = await this.fetch(`${baseURL}/v1/rerooms_crm/features/enums?name=apartments`, {headers});
    const rooms = await resRooms.json();
    
    // Определяем активную категорию
    // и наличие дочерних категорий (и необходимость делать запрос товаров)
    const path = page.path;
    let cat;
    let subcat;
    let subsubcat;
    let room;
    let childrenCats = null;
    let activeCategory = null;
    let activeRoom = null;
    let url;
    let filters = null;
    let products = null;
    let requestFiltersAndProducts = false;
    
    if (path.match(/^\/rooms\//)) { // Если мы в комнатах
      // запрашиваем список комнат
      [room, cat, subcat, subsubcat] = path.split('/').slice(2);
      activeRoom = rooms.filter(r => r.key === room)[0];
      const resRoomMenu = await this.fetch(`${baseURL}/v1/taxons?q[by_apartment]=${room}`, {headers});
      let roomMenu = await resRoomMenu.json();
      
      // приводим в вид дерева
      roomMenu = dataHelpers.arrayToTree(roomMenu.taxons,`rooms/${room}`);
      const temp = dataHelpers.childrenCats1(roomMenu, [cat, subcat, subsubcat]);
      
      childrenCats = temp.childrenCats;
      activeCategory = temp.activeCategory;
      requestFiltersAndProducts = !(childrenCats && childrenCats.length && childrenCats.length>0);
    }
    
    if (path.match(/^\/catalog\//)) { // Если мы в каталоге
      [cat, subcat, subsubcat] = path.split('/').slice(2);
      const temp = dataHelpers.childrenCats1(categories, [cat, subcat, subsubcat]);
      childrenCats = temp.childrenCats;
      activeCategory = temp.activeCategory;
      requestFiltersAndProducts = !(childrenCats && childrenCats.length && childrenCats.length>0);
    }
    
    // Если это страница каталога или комнаты
    // и дочерних категорий нет, запрашиваем фильтры и продукты 
    
    if (requestFiltersAndProducts) {
      const paramsString = dataHelpers.formRequest(activeCategory, path, activeRoom);
      
      // Запрашиваем фильтры
      url = `${baseURL}/v1/rerooms_crm/products/filters/${paramsString}`;
      const resFilters = await this.fetch(url, {headers});
      filters = await resFilters.json();
      
      // Запрашиваем продукты
      url = `${baseURL}/v2/products/${paramsString}`;
      url += '&per_page=12';
      const resProducts = await this.fetch(url, {headers});
      products = await resProducts.json();
    }
    
    // TODO: 
    // если фильтры и продукты запрашивать надо,
    // а активной категории нет -
    if (requestFiltersAndProducts && !activeCategory) {
      // редирект на 404 или нижнюю существующую категорию
      requestFiltersAndProducts = 'error'
    }
    
    return {
      categories,
      activeCategory,
      rooms,
      room,
      cat,
      subcat,
      subsubcat,
      childrenCats,
      filters,
      products,
      requestFiltersAndProducts
    };
  }
</script>

<script>  
  // import Header from '../components/Header/index.svelte';
  import Breadcrumbs from '../components/Breadcrumbs/index.svelte';
  import { roomsData, categoriesData, activeCategoryData, pathData, isLowest, someData } from '../stores/menuStore';
  import { productsData, filtersData, childrenCatsData } from '../stores/productsStore';
  
  export let categories;
  export let activeCategory;
  export let rooms;
  export let room;
  export let cat;
  export let subcat;
  export let subsubcat;
  export let childrenCats;
  export let filters;
  export let products;
  export let requestFiltersAndProducts;
  
  //debugger
  // кладем в сторы
  isLowest.set(requestFiltersAndProducts);
  categoriesData.set(categories);
  activeCategoryData.set(activeCategory);
  roomsData.set(rooms);
  productsData.set(products);
  filtersData.set(filters);
  childrenCatsData.set(childrenCats);
  pathData.set({cat, subcat, subsubcat, room});
  
  export let segment;
</script>

<style global src="../styles/global.scss">
</style>

<div>!!! PARENT LAYOUT {$someData}!!!!</div>
<div>$pathData:</div>
<div class="yellow">{Object.keys($pathData).map(key => $pathData[key])}</div>
<Breadcrumbs />

<main class="main">
  <slot />
</main>
