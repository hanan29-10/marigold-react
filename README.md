# MORON ShopBoard

MORON ShopBoard is a single-page luxury leather-goods storefront. It renders an editorial home page, product catalog, product details, shopping bag, and simulated checkout.

## Features

- Loads the product catalog from the MORON products API with loading and retry states.
- Supports category filtering, search, sorting, product details, saved-item feedback, and quick add.
- Persists the shopping bag in local storage and provides cart quantity controls and a simulated checkout.
- Includes responsive navigation, product carousels, a newsletter confirmation, and reduced-motion-aware UI motion.

## Stack

- Vite, TypeScript, HTML, and CSS
- ESLint with TypeScript rules and Prettier
- Husky and lint-staged for pre-commit formatting and linting

## Getting started

```bash
npm install
npm run dev
```

Use `npm run build` to create a production build and `npm run preview` to serve it locally.

## Validation

```bash
npm run lint
npm run format:check
npm run typecheck
npm run build
```

`npm run format` applies Prettier formatting. The pre-commit hook runs lint-staged for supported staged files.

## Structure

```text
src/
  app/                 Application composition export
  modules/
    cart/              Cart state, persistence, logic, types, and drawer UI
    products/          Product API, catalog state, logic, types, and card UI
  pages/               Route rendering, page UI, event binding, header, footer, and motion
  shared/ui/           Reusable UI utilities such as toast feedback
  styles/              Global stylesheet
public/images/         MORON product and campaign images
```
