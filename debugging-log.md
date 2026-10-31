# Debugging Log — MORON Project (Part 3)

## Note

The issues below were found by reviewing the current project source. No
application code was changed for this log. Therefore, every fix in this
document is **proposed**, not completed.

## 1. Category tiles do not select a category

- **What I saw:** The `Totes`, `Shoulder bags`, and `Evening` tiles open the
  shop, but the catalog remains on `All` products.
- **Type:** Logic.
- **How I found it:** I reviewed the tile links and the catalog state in the
  homepage code.
- **Cause (file and line):** `src/pages/home.js:26` gives all three tiles the
  same `href="#/shop"`. It does not provide a category value to the catalog.
- **Fix:** **Proposed, not completed.** Add a category value to each tile and
  update `src/main.js` to set `catalogState.category` before rendering the
  catalog. Map `Evening` to the existing `Clutches` category, or rename the
  data category consistently.
- **Did I use AI? For what?** Yes. AI reviewed the route and catalog code to
  identify why the links do not filter products.

## 2. Product-card save buttons have no action

- **What I saw:** Product cards show a heart-shaped Save button, but there is
  no save behaviour in the application.
- **Type:** Logic.
- **How I found it:** I compared the product-card markup with the click
  handlers in the main application file.
- **Cause (file and line):** `src/components/productCard.js:4` creates a
  button with the `wishlist-button` class. `src/main.js:49` starts the click
  handler, but it has no branch for `wishlist-button` and there is no wishlist
  module.
- **Fix:** **Proposed, not completed.** Add a `data-save` value to the button,
  create a wishlist module, and handle the button click in `src/main.js`.
- **Did I use AI? For what?** Yes. AI checked the component and event-handler
  code for the missing connection.

## 3. Cart prices are trusted from browser storage

- **What I saw:** The cart can load product prices from the browser's Local
  Storage instead of rebuilding them from the project product data.
- **Type:** State.
- **How I found it:** I followed the cart loading and total-calculation code.
- **Cause (file and line):** `src/modules/storage.js:10` only checks that a
  stored price is a number. `src/modules/cart.js:12` uses that stored price to
  calculate the total. It is not checked against `src/data/products.js`.
- **Fix:** **Proposed, not completed.** Store only product IDs and quantities,
  then rebuild cart products from `src/data/products.js` when loading the cart.
  A real checkout should calculate prices on a server.
- **Did I use AI? For what?** Yes. AI traced the Local Storage validation and
  cart total calculation.

## 4. The product-detail image fallback can show the wrong image

- **What I saw:** When a detail-page image fails, the fallback always uses one
  external handbag image, even for a different product.
- **Type:** Runtime.
- **How I found it:** I reviewed the image error handling in the product-detail
  page template.
- **Cause (file and line):** `src/pages/productDetails.js:5` has an inline
  `onerror` handler that replaces every failed image with the same Unsplash
  URL.
- **Fix:** **Proposed, not completed.** Use a JavaScript error listener and a
  local MORON placeholder image, or hide the failed image while keeping the
  product name and description visible.
- **Did I use AI? For what?** Yes. AI reviewed the fallback code and identified
  the mismatch between the fallback image and the selected product.

## Verification

- `npm.cmd run build` completed successfully before this log update.
- `npm.cmd run format:check` completed successfully after this log update.
- `package.json` has no automated test script, so no automated feature-test
  result is claimed.
