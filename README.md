# MARIGOLD

MARIGOLD is a single-page luxury leather-goods storefront. It renders an editorial home page, product catalog, product details, shopping bag, and simulated checkout.

## Features

- Loads the product catalog from the MARIGOLD products API with loading and retry states.
- Supports category filtering, search, sorting, product details, saved-item feedback, and quick add.
- Persists the shopping bag in local storage and provides cart quantity controls and a simulated checkout.
- Includes responsive navigation, product carousels, a newsletter confirmation, and reduced-motion-aware UI motion.

## Stack

- React, Vite, TypeScript, HTML, and CSS
- ESLint with TypeScript rules and Prettier
- Husky and lint-staged for pre-commit formatting and linting

## Getting started

```bash
npm install
npm run dev
```

Use `npm run build` to create a production build and `npm run preview` to serve it locally.

## API deployment

The application fetches its catalog from `https://marigold-api.vercel.app` by default. Set `VITE_MARIGOLD_API_BASE_URL` to a different MARIGOLD API host in the hosting environment only when needed, then redeploy the application.

## Repository and folder rename

Rename the GitHub repository to `marigold`, then update the local remote with `git remote set-url origin https://github.com/hanan29-10/marigold.git`. With no process using the project directory, rename the current project folder to `marigold`; Git metadata and relative project paths continue to work.

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
  app/
    App.tsx            Small application shell
    AppProviders.tsx   Cart and wishlist provider composition
    AppRoutes.tsx      Hash route to page mapping
  components/
    Header.tsx         Site-wide navigation and bag trigger
    Footer.tsx         Site-wide footer
  features/
    cart/              Cart React context, drawer, pure logic, storage, and types
    products/          Product API, validation, filtering/sorting, types, hook, and card
    wishlist/          Saved-product React context and persistence
  pages/
    home/
      HomePage.tsx
      components/      HeroCarousel, Collections, FeaturedProducts, Newsletter
    shop/
      ShopPage.tsx
      components/      SearchBar, ProductFilters, ProductGrid
    product/
      ProductPage.tsx
      components/      ProductDetails
    cart/
      CartPage.tsx
      components/      CartItems
    checkout/
      CheckoutPage.tsx
      components/      CheckoutForm
  shared/              Generic API client plus hash-route and scroll-reveal hooks
  styles/              Global MARIGOLD stylesheet
  main.tsx             React entry point
public/images/         MARIGOLD product and campaign images
```

## Reusable component props

Every reusable component has a typed props interface in its own file. The main
examples are:

| Component          | Props                                          | Responsibility                    |
| ------------------ | ---------------------------------------------- | --------------------------------- |
| `Header`           | `onBagOpen`                                    | Site navigation and bag trigger   |
| `CartDrawer`       | `open`, `onClose`                              | Persistent bag drawer             |
| `ProductCard`      | `product`                                      | Shared catalog card and quick add |
| `FeaturedProducts` | `title`, `eyebrow`, `products`, `className`    | Homepage catalog rows             |
| `ProductGrid`      | `products`                                     | Shop result grid                  |
| `ProductFilters`   | `categories`, `selected`, `onSelect`           | Shop category controls            |
| `SearchBar`        | `term`, `sort`, `onTermChange`, `onSortChange` | Shop search and sort controls     |
| `CheckoutForm`     | `onComplete`                                   | Checkout data collection          |

## State ownership

- `App` owns only drawer visibility and app composition.
- `useProducts` owns API loading, retry/error state, products, and categories.
- `CartProvider` owns cart state and writes it to local storage.
- `WishlistProvider` owns saved product IDs and writes them to local storage.
- `ShopPage` owns its search term, selected category, and sort choice.
- Page-local UI state stays with the component that needs it: the hero active
  slide, newsletter success message, checkout success message, and product
  quantity.

## File moves

| Old location                                | New location                                      | Why                                                                               |
| ------------------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------- |
| `src/features/cart/model/*`                 | `src/features/cart/*`                             | The feature is easier to navigate without a one-purpose `model` folder.           |
| `src/features/products/api/products.api.ts` | `src/features/products/products.api.ts`           | Product API now sits with the rest of its feature files.                          |
| `src/modules/products/products.logic.ts`    | `src/features/products/products.logic.ts`         | Pure catalog operations belong to the products feature.                           |
| `src/modules/products/products.types.ts`    | `src/features/products/products.types.ts`         | Product types are owned by the products feature.                                  |
| `src/modules/products/products.format.ts`   | `src/features/products/products.format.ts`        | Product price formatting is used by product UI.                                   |
| `src/hooks/useHashRoute.ts`                 | `src/shared/useHashRoute.ts`                      | Hash routing is a generic browser hook.                                           |
| `src/shared/ui/useScrollReveal.ts`          | `src/shared/useScrollReveal.ts`                   | Scroll reveal is a shared generic hook, not a UI barrel export.                   |
| `src/shared/api/client.ts`                  | `src/shared/apiClient.ts`                         | The generic request client is easier to find without nesting.                     |
| `src/components/layout/*`                   | `src/components/*`                                | Header and Footer are shared components; a one-item layout layer was unnecessary. |
| `src/sections/*`                            | `src/pages/home/components/*`                     | Homepage sections are colocated with their only route.                            |
| `src/components/SearchBar.tsx`              | `src/pages/shop/components/SearchBar.tsx`         | Search is only used by Shop.                                                      |
| `src/components/ProductFilters.tsx`         | `src/pages/shop/components/ProductFilters.tsx`    | Filters are only used by Shop.                                                    |
| `src/components/ProductGrid.tsx`            | `src/pages/shop/components/ProductGrid.tsx`       | The catalog grid is only used by Shop.                                            |
| `src/components/ProductDetails.tsx`         | `src/pages/product/components/ProductDetails.tsx` | Details are only used by ProductPage.                                             |
| `src/components/CartItems.tsx`              | `src/pages/cart/components/CartItems.tsx`         | Cart items are only used by CartPage.                                             |
| `src/components/CheckoutForm.tsx`           | `src/pages/checkout/components/CheckoutForm.tsx`  | Checkout fields are only used by CheckoutPage.                                    |
| `src/app/providers/AppProviders.tsx`        | `src/app/AppProviders.tsx`                        | Provider composition is simple enough to be flat.                                 |
| `src/app/routes/AppRoutes.tsx`              | `src/app/AppRoutes.tsx`                           | Route selection is simple enough to be flat.                                      |

The original Day 3 cart/product logic, API validation, types, and storage files
were moved without behavioral changes. `products.types.ts` received only the
`isCatalogSort` type guard needed to remove a select-value type assertion.
