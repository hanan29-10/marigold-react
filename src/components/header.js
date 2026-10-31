import { getCartCount } from '../modules/cart.js';

export function header() {
  return `<header class="site-header"><a class="brand" href="#/" aria-label="MORON home">MORON <small>leather goods</small></a><button class="menu-button" type="button" aria-label="Toggle navigation" aria-expanded="false"><span></span><span></span><b>Menu</b></button><nav aria-label="Main navigation"><a href="#/">Home</a><a href="#/shop">Shop all</a><a href="#/shop">New in</a><button class="nav-collections" type="button" aria-expanded="false">Collections <span>+</span></button><div class="nav-dropdown"><a href="#/shop" data-category-link="Totes">Totes</a><a href="#/shop" data-category-link="Shoulder Bags">Shoulder bags</a><a href="#/shop" data-category-link="Clutches">Evening</a></div></nav><div class="header-actions"><button class="header-icon search-link" type="button" aria-label="Search products">⌕</button><button class="header-icon account-link" type="button" aria-label="Profile"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"></circle><path d="M4.5 20a7.5 7.5 0 0 1 15 0"></path></svg></button><a href="#/cart" class="cart-link" data-cart-toggle aria-label="Open shopping bag"><span>Bag</span><b class="cart-count">${getCartCount()}</b></a></div></header>`;
}
export function refreshCartCount() {
  document.querySelectorAll('.cart-count').forEach((count) => {
    count.textContent = getCartCount();
  });
}
