import { writable } from 'svelte/store';

export const someData = writable(42);
export const categoriesData = writable(null);
export const roomsData = writable([]);
export const activeCategoryData = writable(null);
export const activeRoomData = writable(null);
export const pathData = writable(null);
export const isLowest = writable(null);