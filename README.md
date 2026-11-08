# MARIGOLD

MARIGOLD is a React luxury leather-goods storefront built with Vite and TypeScript.

## Stack

- React 19, TypeScript, Vite, CSS, Tailwind/shadcn/ui primitives
- React Hook Form, Zod, and `@hookform/resolvers`
- Playwright, ESLint, Prettier, Husky, and lint-staged

## Architecture

```text
src/
  app/                 application composition, routes, providers, layout
  modules/             cart, products, and wishlist feature state/logic/API
  pages/               Home, Shop, Product, Cart, Checkout, Wishlist, NotFound
  shared/              API client, generic hooks, ErrorBoundary, shadcn UI
  styles/              global MARIGOLD styles
  main.tsx             React entry point
```

`app` may compose pages, modules, and shared code. Modules own feature code and never import pages. Pages compose modules. Shared code is dependency-safe and does not import pages or modules. See `AGENTS.md` for the full placement rules.

## Routes

| Hash route      | Page               |
| --------------- | ------------------ |
| `/`             | Home               |
| `/shop`         | Shop               |
| `/product/:id`  | Product detail     |
| `/cart`         | Shopping bag       |
| `/checkout`     | Simulated checkout |
| `/wishlist`     | Saved pieces       |
| any other route | Not found          |

Route pages are lazy loaded with `React.lazy` and rendered in `Suspense`. `ErrorBoundary` isolates rendering failures from API loading/error states.

## State and API

`CartProvider` and `WishlistProvider` are Context providers. Cart localStorage stores only `{ id, quantity }`, migrates legacy entries, caps each product at ten, and resolves current products/prices from the catalog. Wishlist persists product IDs.

The catalog uses `GET /api/products`; product details use only `GET /api/products/:id`. Product, catalog, empty, retry, error, loading, and 404 states have dedicated UI.

Checkout uses React Hook Form with a centralized Zod schema and accessible field-level errors. shadcn Button, Input, and Label primitives preserve the MARIGOLD styling.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
npm run typecheck
npm run lint
npm run format
npm run format:check
npx playwright test --project=chromium
```

The default API host is `https://marigold-api.vercel.app`; override it with `VITE_MARIGOLD_API_BASE_URL` when required.
