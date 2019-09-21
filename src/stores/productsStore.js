import { writable } from 'svelte/store';

export const productData = writable(null);
export const productsData = writable([]);
export const filtersData = writable(null);
export const childrenCatsData = writable(null);
