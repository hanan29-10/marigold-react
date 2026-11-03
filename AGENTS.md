# MORON ShopBoard Agent Instructions

## Technology stack

- Vite, TypeScript, HTML5, and CSS3
- ESLint, Prettier, Husky, and lint-staged

## Where new work belongs

- Put product catalog data access, types, filtering, and card UI in `src/modules/products/`.
- Put cart state, persistence, cart operations, types, and drawer UI in `src/modules/cart/`.
- Put route/page markup and application coordination in `src/pages/`; keep browser event binding in `src/pages/application.events.ts`.
- Put reusable UI helpers in `src/shared/ui/` and global styles only in `src/styles/main.css`.
- Keep public module exports in each module's `index.ts`; do not import another module's private implementation file when a public export can be added.

## Rules learned from project mistakes

1. **Select the product-grid container by page scope.** A broad grid selector can update the wrong editorial grid instead of the featured catalog. Use the catalog-scoped selector and verify search, filter, and sort only update the catalog.
2. **Update catalog state before category navigation.** Collection links must set the selected category, update the matching filter state, and then render/scroll to the shop. Verify the visible active filter and displayed products agree after navigation.
3. **Do not run Node-only tests by importing the browser entrypoint.** `src/main.ts` imports CSS, which plain Node cannot load. Test browser behavior through a browser-capable runner or test isolated logic modules that do not import CSS.

## General rules

1. Use semantic HTML and give every input a label.
2. Follow mobile-first CSS with `min-width` enhancements; do not use `!important`.
3. Preserve TypeScript safety: avoid `any`, `as` assertions, and non-null assertions; prefer runtime guards.
4. Run lint, Prettier, typecheck, and build after relevant changes.
5. Explain every code change.
