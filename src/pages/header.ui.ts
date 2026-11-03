import { getCartCount } from '../modules/cart';

export function header() {
  return `<div class="announcement-bar"><span>New Season &mdash; The Autumn Edit 2026</span><i aria-hidden="true"></i><span><b class="shipping-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 6.5h11v10H3z"></path><path d="M14 10h3.7l2.3 2.8v3.7H14z"></path><circle cx="7" cy="18" r="1.5"></circle><circle cx="17" cy="18" r="1.5"></circle></svg></b> Worldwide Shipping <em>|</em> Free Returns</span></div><header class="site-header"><a class="brand" href="#/" aria-label="MORON home">MORON <small>leather goods</small></a><button class="menu-button" type="button" aria-label="Toggle navigation" aria-expanded="false"><span></span><span></span><b>Menu</b></button><nav aria-label="Main navigation"><a class="active" href="#/">Home</a><a href="#/shop">Shop all</a><a href="#/shop">New in</a><button class="nav-collections" type="button" aria-expanded="false"><span class="nav-label">Collections</span><span class="nav-plus" aria-hidden="true">+</span></button><div class="nav-dropdown"><a href="#/shop" data-category-link="Totes">Totes</a><a href="#/shop" data-category-link="Shoulder Bags">Shoulder bags</a><a href="#/shop" data-category-link="Clutches">Evening</a></div></nav><div class="header-actions"><button class="header-icon search-link" type="button" aria-label="Search products"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.6"></circle><path d="m16 16 4.3 4.3"></path></svg></button><button class="header-icon account-link" type="button" aria-label="Profile"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"></circle><path d="M4.5 20a7.5 7.5 0 0 1 15 0"></path></svg></button><a href="#/cart" class="cart-link" data-cart-toggle aria-label="Open shopping bag"><span>Bag</span><b class="cart-count">${getCartCount()}</b></a></div></header>`;
}

export function refreshCartCount() {
  document.querySelectorAll('.cart-count').forEach((count) => {
    count.textContent = String(getCartCount());
  });
}
