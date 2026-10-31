# Debugging Log — ShopBoard / MORON

## Independent debugging commitment

Before asking Codex about a new issue, I will spend **10 minutes** reproducing it, reading the browser console and terminal output, checking the relevant module, and trying one small fix. I will then add the result here.

> I must complete this statement myself after I do it; it has not been claimed as complete by Codex.

## 1. Catalog results were targeting the wrong product grid

- **What I saw:** After adding the Signature Pieces and New Arrivals rows, search, filters, and sorting could have replaced the first visible product row instead of the Featured Pieces catalog.
- **Bug type:** Logic.
- **How I found it:** I inspected the page structure after adding more than one `.product-grid` and traced the selector used by `renderCatalog`.
- **Cause:** `src/pages/home.js:7` creates editorial product grids before the main catalog. A broad selector such as `document.querySelector('.product-grid')` returns the first matching grid, not necessarily the interactive catalog grid.
- **Fix:** `src/pages/home.js:20` now uses `document.querySelector('.catalog .product-grid')`, which targets the product grid inside the catalog section only.
- **AI used and why:** Yes. Codex helped identify the selector collision while restructuring the homepage. I should still be able to explain that `querySelector` returns the first matching element.
- **My explanation in my own words:** _[Write why a general selector selected the wrong grid.]_

## 2. Product cards had an inline image-error handler

- **What I saw:** The prior product-card markup used an `onerror` HTML attribute for image fallback behavior.
- **Bug type:** Logic / maintainability.
- **How I found it:** I reviewed `src/components/productCard.js` while standardizing the generated local campaign images.
- **Cause:** An inline event handler mixes DOM behavior into a template string. It conflicts with the project rule to use event listeners rather than inline JavaScript and makes the component harder to reuse and test.
- **Fix:** `src/components/productCard.js:4` now uses local, controlled campaign image paths from product data and has no inline JavaScript handler.
- **AI used and why:** Yes. Codex refactored the component to preserve the modular event-driven architecture.
- **My explanation in my own words:** _[Write why behavior should not be embedded in an HTML string.]_

## 3. Formatting validation initially failed

- **What I saw:** `npm.cmd run format:check` reported formatting warnings across project files.
- **Bug type:** Runtime / tooling.
- **How I found it:** I ran the project’s available formatting check before the production build.
- **Cause:** New and edited JavaScript, CSS, HTML, and Markdown did not yet match the repository’s Prettier configuration. This was not a browser-feature failure, but it blocked the required validation step.
- **Fix:** Ran `npm.cmd run format`, then reran `npm.cmd run format:check`. The check passed.
- **AI used and why:** Yes. Codex ran the repository’s existing formatter because it is the project’s defined formatting tool.
- **My explanation in my own words:** _[Write why formatting checks can fail even when code can build.]_

## 4. PowerShell blocked the `npm` script shim

- **What I saw:** Running `npm run build` in PowerShell failed with an execution-policy error for `npm.ps1`.
- **Bug type:** Runtime.
- **How I found it:** I attempted the production build from the project directory.
- **Cause:** PowerShell’s execution policy blocked the `npm.ps1` shim, before Vite could run. The application code was not the cause.
- **Fix:** Used `npm.cmd run build`, which invokes the Windows command shim instead. The Vite production build completed successfully.
- **AI used and why:** Yes. Codex selected the equivalent Windows-safe command after reading the terminal error.
- **My explanation in my own words:** _[Write why this was an environment issue rather than a JavaScript bug.]_

## Verification record

- `npm.cmd run format:check` — passed.
- `npm.cmd run build` — passed.
