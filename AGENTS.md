# MARIGOLD

## Technology stack

-React, Vite, TypeScript, HTML5, and CSS3
-ESLint, Prettier, Husky, and lint-staged

## General rules

1.Use semantic HTML, accessible React components, and give every input a label.

2.Follow mobile-first CSS with min-width enhancements; do not use !important.

3. Preserve TypeScript safety: avoid `any`, `as` assertions, and non-null assertions; prefer runtime guards.

4.Use React functional components, hooks, and Context; avoid unnecessary direct DOM manipulation.

5.Preserve the MARIGOLD design system, including consistent colors, typography, spacing, and animations.

6.Run lint, Prettier, typecheck, and build after relevant changes.

7.Briefly explain each code change and its purpose.

## Component placement

- `src/app/` is the application composition layer only: app entry composition, routing, providers, and the shared application layout. Keep `App.tsx` declarative and move feature behavior out of it.
- `src/modules/<module>/` owns feature-specific components, hooks, API calls, types, state, and business logic. Feature-owned UI belongs in its module's `components/` directory (for example, `modules/cart/components/CartDrawer.tsx`).
- `src/pages/<page>/` contains route-level pages and UI used only by that route in `components/`.
- `src/shared/` contains dependency-free reusable UI, hooks, utilities, and API infrastructure. Shared code must not import from `src/modules/` or `src/pages/`.
- Modules must not import from pages. Pages may compose modules and shared code; app may compose pages, modules, and shared code. Do not duplicate a component to satisfy two locations.

## Project-specific regression rules

1. **Desktop navigation positioning**
   - Mistake: desktop navigation can be positioned relative to the viewport or one side of the header, so it drifts instead of remaining centered between the brand and actions.
   - Prevention: at desktop breakpoints, keep navigation in the `main-navbar` grid's dedicated `navigation` area; its outer columns must be symmetric flexible columns.
   - Verification: inspect the header at 700px, 1024px, and 1440px with short and long cart counts, confirming that the navigation is centered and its collections menu is anchored to the navigation control.

2. **Mobile header overflow at 375px**
   - Mistake: fixed-width header controls and an unconstrained wordmark can exceed the narrow viewport, creating horizontal scroll or clipping actions.
   - Prevention: keep the mobile header grid's brand column `minmax(0, 1fr)`, give the brand `min-width: 0`, and only use compact icon controls below the desktop breakpoint.
   - Verification: test at a 375px viewport with the cart count visible; confirm no horizontal page overflow and that the menu, search, wishlist, and bag controls remain tappable.

3. **Unsafe cleanup with unrelated Git changes**
   - Mistake: broad cleanup commands can overwrite or delete a collaborator's uncommitted work while addressing an isolated review comment.
   - Prevention: inspect `git status --short` before changing files, preserve unrelated paths, and use targeted patches or moves only. Never use `git reset --hard`, `git checkout --`, or broad recursive deletion unless the user explicitly requests it.
   - Verification: compare `git status --short` and `git diff --name-status` before handoff; every changed path must be attributable to the requested work.

4. **Cart price integrity**
   - Mistake: persisting product objects in the cart stores a client-controlled price that can become stale or be manipulated.
   - Prevention: persist only `{ productId, quantity }`, resolve display prices from the current catalog, and ensure checkout pricing is recalculated by the server before a real order is accepted.
   - Verification: inspect localStorage after adding an item, refresh after a catalog price change, and confirm the displayed subtotal is derived from the catalog rather than persisted product data.
