# Slivasa — Digital Restaurant Menu

An elegant, book-style digital menu for Slivasa Restaurant & Café. Built as a
React single-page app with a realistic page-turning experience: a two-page
open-book spread on desktop, and a single-page horizontal flip on mobile.

## Tech stack

- React 19 + TypeScript
- TanStack Start / TanStack Router (file-based routing, SSR)
- Tailwind CSS v4
- Vite

## Project structure

```
src/
  assets/            Menu photography
  data/menu.ts        Menu content (pages, items, prices) — edit this to
                       add or remove menu items without touching any UI code
  components/menu/    Reusable menu UI: MenuBook, MenuPage, MenuItem,
                       PageTurn, Navigation, FoodImage
  routes/             File-based routes (index.tsx is the menu page)
  styles.css          Design tokens + layout styles
```

## Development

You need Node.js and npm.

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

## Editing the menu

Menu pages and items live in `src/data/menu.ts` as a plain array — add,
remove, or reorder items there and the book updates automatically.
