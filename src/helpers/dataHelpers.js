const level2tax = (prefix, links, names, id) => {
  if (links[2]) {
    return {
      link: links[2],
      name: names[2],
      permalink: `${prefix}/${links[0]}/${links[1]}/${links[2]}`,
      id
    }
  }
}

const level1tax = (prefix, links, names, id) => {
  let res = {
    link: links[1],
    name: names[1],
    permalink: `${prefix}/${links[0]}/${links[1]}`,
  }
  const taxon = level2tax(prefix, links, names, id);
  if (taxon) {
    res.taxons = [taxon];
  } else {
    res.id = id;
  }
  return res
}

const level0tax = (prefix, links, names, id) => ({
  link: links[0],
  name: names[0],
  permalink: `${prefix}/${links[0]}`,
  taxons: [level1tax(prefix, links, names, id)],
});

const arrayToTree = (taxons, prefix) => {
  const res = [];
  taxons.forEach(taxon => {
    const names = taxon.pretty_name.split(' -> ');
    const links = taxon.permalink.split('/');
    const id = taxon.id;
    const level0 = res.filter(tax => tax.link === links[0]);

    if (level0.length === 0) {
      res.push(level0tax(prefix, links, names, id));
    } else {
      const level1 = level0[0].taxons.filter(tax => tax.link === links[1]);
      if (level1.length === 0) {
        level0[0].taxons.push(level1tax(prefix, links, names, id));
      } else {
        if (level1[0].taxons) {
          const level2 = level1[0].taxons.filter(tax => tax.link === links[2]);
          if (level2.length === 0) {
            level1[0].taxons.push(level2tax(prefix, links, names, id));
          }
        }
      }
    }
  });
  return res;
};

const getCat = (curCat, path, counter) => {
  const c = counter || 0;
  if (curCat
    && curCat.taxons
    && curCat.taxons.length
    && curCat.taxons.length > 0
    && path[c]
  ) {
    return getCat(curCat.taxons.filter(tax =>
      tax.link === path[c]
      || tax.permalink.match(new RegExp(path[c]+'$')))[0], path, c + 1
    );
  }
  return curCat;
};

// const childrenCats = (tree, path) => {
//   const cat = getCat(
//     { taxons: tree },
//     path
//   );
//   return (cat.taxons
//     && cat.taxons.length
//     && cat.taxons.length > 0) && cat.taxons;
// };

const childrenCats1 = (tree, path) => {
  const activeCategory = getCat(
    { taxons: tree },
    path
  );
  const childrenCats = (activeCategory.taxons
    && activeCategory.taxons.length
    && activeCategory.taxons.length > 0) && activeCategory.taxons
  return {childrenCats, activeCategory};
};

const childrenCatsRooms = (tree, path) => {
  const activeCategory = getCat(
    { taxons: tree },
    path
  );
  const childrenCats = (activeCategory.taxons
    && activeCategory.taxons.length
    && activeCategory.taxons.length > 0) && activeCategory.taxons
  return {childrenCats, activeRoom};
};

const formCrumbs = (path) => {
  let crumbs = [{
    name: 'Главная',
    permalink: '/'
  }];
  
  if (path) {
    const {cat, subcat, subsubcat, room} = path;
    let prefix = '';

    if (room) {
      crumbs = crumbs.concat([
        {
          name: 'Комнаты',
          permalink: null
        }, {
          name: room,
          permalink: `/rooms/${room}`
        }
      ]);
      prefix = `/rooms/${room}`;
    } else if (cat) {
      crumbs.push({
        name: 'Каталог',
        permalink: null
      });
      prefix = `/catalog`;
    } else {
      crumbs[0].permalink = null;
      return crumbs
    }

    // temp

    const p = [cat, subcat, subsubcat].map(c => ({link: c, name: c}))

    // temp /

    crumbs = crumbs.concat(p.reduce((acc, cat, i) => {
      if (cat.link) {
        if (i === 0) {
          cat.permalink = `${prefix}/${cat.link}`;
        } else {
          const prev = acc[acc.length - 1];
          cat.permalink = `${prev.permalink}/${cat.link}`;
        }
        acc.push(cat);
      }
      return acc
    }, []));
  }
  crumbs[crumbs.length - 1].permalink = null;
  return crumbs
};

const formRequest = (activeCategory, path, activeRoom) => {
  const requestParams = {};

  if (path.match(/^\/catalog\//)) {
    requestParams['q[taxons_id_eq]'] = activeCategory.id;
  }
  
  if (path.match(/^\/rooms\//)) {
    requestParams['q[taxons_id_eq]'] = activeCategory.id;
    requestParams['q[feature_apartment_eq]'] = activeRoom.id;
    // Добавить в параметры комнату
  }

  // добавить в параметры номер страницы при запросе продуктов, не фильтров

  return Object.keys(requestParams)
    .reduce((res, key) => `${res}${key}=${requestParams[key]}&`, '?')
    .slice(0, -1);
};

export default {
  getCat,
  formCrumbs,
  arrayToTree,
  // childrenCats,
  childrenCats1,
  childrenCatsRooms,
  formRequest
};