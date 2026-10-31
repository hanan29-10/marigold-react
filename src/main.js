import './styles/main.css';
import { products } from './data/products.js';
import {
  addToCart,
  clearCart,
  getCart,
  updateQuantity,
  removeFromCart,
} from './modules/cart.js';
import { validateCheckout } from './modules/checkout.js';
import { findProduct } from './modules/products.js';
import { footer } from './components/footer.js';
import { cartDrawer } from './components/cartDrawer.js';
import { header, refreshCartCount } from './components/header.js';
import { startCarousel } from './components/hero.js';
import { cartPage } from './pages/cartPage.js';
import { checkoutPage } from './pages/checkoutPage.js';
import { homePage, renderCatalog } from './pages/home.js';
import { productDetailsPage } from './pages/productDetails.js';
import { initMotion, initSignatureCarousel } from './modules/motion.js';
const app = document.querySelector('#app');
let catalogState = { category: 'All', term: '', sort: 'featured' };
let carouselTimer;
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('p');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    document.body.append(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2500);
}
function renderLayout(content) {
  window.clearInterval(carouselTimer);
  app.innerHTML = `${header()}<main class="page-transition">${content}</main>${footer()}${cartDrawer()}`;
  initMotion();
  initSignatureCarousel();
}
function setDrawer(open) {
  const drawer = document.querySelector('.cart-drawer');
  const scrim = document.querySelector('.drawer-scrim');
  if (!drawer || !scrim) return;
  drawer.classList.toggle('open', open);
  scrim.classList.toggle('open', open);
  drawer.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('drawer-open', open);
}
function refreshDrawer() {
  const drawer = document.querySelector('.cart-drawer');
  const scrim = document.querySelector('.drawer-scrim');
  if (!drawer || !scrim) return;
  const wasOpen = drawer.classList.contains('open');
  drawer.outerHTML = cartDrawer().split('<button class="drawer-scrim"')[0];
  setDrawer(wasOpen);
}
function renderRoute() {
  const [, page = '', id] = location.hash.slice(1).split('/');
  if (page === 'product') renderLayout(productDetailsPage(findProduct(id)));
  else if (page === 'cart') renderLayout(cartPage());
  else if (page === 'checkout') renderLayout(checkoutPage());
  else {
    renderLayout(homePage());
    renderCatalog(catalogState);
    carouselTimer = startCarousel();
  }
}
document.addEventListener('click', (event) => {
  const add = event.target.closest('[data-add]');
  if (add) {
    const product = products.find((item) => item.id === add.dataset.add);
    const quantity = add.hasAttribute('data-detail-add')
      ? Number(document.querySelector('#quantity').value)
      : 1;
    if (!product || !Number.isInteger(quantity) || quantity < 1) return;
    addToCart(product, quantity);
    refreshCartCount();
    showToast(`${product.name} added to your bag.`);
    refreshDrawer();
    setDrawer(true);
    return;
  }
  const save = event.target.closest('[data-wishlist]');
  if (save) {
    const saved = save.getAttribute('aria-pressed') === 'true';
    save.setAttribute('aria-pressed', String(!saved));
    save.classList.toggle('saved', !saved);
    showToast(saved ? 'Removed from saved pieces.' : 'Saved for later.');
    return;
  }
  const category = event.target.closest('[data-category]');
  if (category) {
    catalogState.category = category.dataset.category;
    document
      .querySelectorAll('[data-category]')
      .forEach((button) =>
        button.classList.toggle('active', button === category),
      );
    renderCatalog(catalogState);
    return;
  }
  const categoryLink = event.target.closest('[data-category-link]');
  if (categoryLink) {
    catalogState.category = categoryLink.dataset.categoryLink;
    location.hash = '#/shop';
    window.setTimeout(() => {
      renderCatalog(catalogState);
      document
        .querySelector(`[data-category="${catalogState.category}"]`)
        ?.classList.add('active');
      document.querySelector('#shop')?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
    return;
  }
  const change = event.target.closest('[data-quantity]');
  if (change) {
    const item = getCart().find(
      (entry) => entry.product.id === change.dataset.quantity,
    );
    updateQuantity(
      item.product.id,
      item.quantity + Number(change.dataset.change),
    );
    renderRoute();
  }
  const remove = event.target.closest('[data-remove]');
  if (remove) {
    removeFromCart(remove.dataset.remove);
    renderRoute();
  }
  const menu = event.target.closest('.menu-button');
  if (menu) {
    const nav = document.querySelector('nav');
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  }
  const collections = event.target.closest('.nav-collections');
  if (collections) {
    const nav = document.querySelector('nav');
    const open = nav.classList.toggle('collections-open');
    collections.setAttribute('aria-expanded', String(open));
  }
  if (event.target.closest('[data-cart-toggle]')) {
    event.preventDefault();
    setDrawer(true);
  }
  if (event.target.closest('.drawer-close, .drawer-scrim')) setDrawer(false);
  if (event.target.closest('.search-link')) {
    location.hash = '#/shop';
    window.setTimeout(() => document.querySelector('#search')?.focus(), 0);
  }
  if (event.target.closest('.account-link')) {
    showToast('Account sign-in is coming soon.');
  }
});
document.addEventListener('input', (event) => {
  if (event.target.id === 'search') {
    catalogState.term = event.target.value;
    renderCatalog(catalogState);
  }
});
document.addEventListener('change', (event) => {
  if (event.target.id === 'sort') {
    catalogState.sort = event.target.value;
    renderCatalog(catalogState);
  }
});
document.addEventListener('submit', (event) => {
  if (event.target.id === 'newsletter-form') {
    event.preventDefault();
    event.target.reset();
    document.querySelector('.newsletter-message').textContent =
      'Thank you — you are on the list.';
    return;
  }
  if (event.target.id !== 'checkout-form') return;
  event.preventDefault();
  const result = validateCheckout(event.target);
  const message = event.target.querySelector('.form-message');
  if (!result.valid) {
    message.textContent = result.message;
    return;
  }
  clearCart();
  renderLayout(
    `<section class="page confirmation"><p class="eyebrow">Order confirmed</p><h1>Thank you, ${result.data.name.split(' ')[0]}.</h1><p>Your order has been placed. This is a simulated confirmation—no payment was processed.</p><a class="button" href="#/shop">Continue shopping <span>&rarr;</span></a></section>`,
  );
});
document.addEventListener('cart:updated', refreshCartCount);
window.addEventListener(
  'scroll',
  () => {
    document
      .querySelector('.site-header')
      ?.classList.toggle('scrolled', window.scrollY > 18);
  },
  { passive: true },
);
window.addEventListener('hashchange', renderRoute);
if (!location.hash) location.hash = '#/';
else renderRoute();
