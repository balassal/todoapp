import { writable } from "svelte/store"

export const themes = [
  {
    name: 'wintry',
    title: "Wintry",
  },
  {
    name: 'skeleton',
    title: "Skeleton",
  },
  {
    name: 'rocket',
    title: "Rocket",
  },
  {
    name: 'vintage',
    title: "Vintage",
  },
  {
    name: 'hamlindigo',
    title: "Hamlindigo",
  },
  {
    name: 'gold-nouveau',
    title: "Gold-Nouveau",
  },
]

export const theme = writable("wintry");
