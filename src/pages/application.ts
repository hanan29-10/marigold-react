import {
  categories,
  fetchProducts,
  products,
  replaceCatalog,
} from '../modules/products';
import {
  addToCart,
  clearCart,
  getCart,
  updateQuantity,
  removeFromCart,
} from '../modules/cart';
import { validateCheckout } from './checkout';
import { findProduct } from '../modules/products';
import { cartDrawer } from '../modules/cart';
import { showToast } from '../shared/ui';
import { footer } from './footer.ui';
import { header, refreshCartCount } from './header.ui';
import { startCarousel } from './hero.ui';
import { cartPage } from './cart';
import { checkoutPage } from './checkout';
import { homePage, renderCatalog } from './home';
import { productDetailsPage } from './product';
import { initMotion, initSignatureCarousel } from './motion';
import type {
  CatalogSort,
  CatalogState,
  ProductCategory,
} from '../modules/products';
const app = document.querySelector<HTMLElement>('#app');
let catalogState: CatalogState = {
  category: 'All',
  term: '',
  sort: 'featured',
};
let carouselTimer: ReturnType<typeof window.setInterval> | undefined;
const isCategory = (value: string): value is ProductCategory | 'All' =>
  categories.includes(value as ProductCategory | 'All');
const isCatalogSort = (value: string): value is CatalogSort =>
  ['featured', 'price-low', 'price-high', 'name'].includes(value);
function closest(
  target: EventTarget | null,
  selector: string,
): HTMLElement | null {
  return target instanceof Element
    ? (target.closest(selector) as HTMLElement | null)
    : null;
}

function renderLayout(content: string) {
  window.clearInterval(carouselTimer);
  if (!app) return;
  app.innerHTML = `${header()}<main class="page-transition">${content}</main>${footer()}${cartDrawer()}`;
  initMotion();
  initSignatureCarousel();
}
function renderCatalogStatus(message: string, retry = false) {
  renderLayout(
    `<section class="page catalog-status" role="status"><p class="eyebrow">The collection</p><h1>${message}</h1>${retry ? '<button class="button" type="button" data-retry-products>Try again <span>&rarr;</span></button>' : ''}</section>`,
  );
}
function setDrawer(open: boolean) {
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
export function startApplication() {
  document.addEventListener('click', (event) => {
    if (closest(event.target, '[data-retry-products]')) {
      void loadProducts();
      return;
    }
    const add = closest(event.target, '[data-add]');
    if (add) {
      const product = products.find((item) => item.id === add.dataset.add);
      const quantity = add.hasAttribute('data-detail-add')
        ? Number(
            (document.querySelector('#quantity') as HTMLSelectElement).value,
          )
        : 1;
      if (!product || !Number.isInteger(quantity) || quantity < 1) return;
      addToCart(product, quantity);
      refreshCartCount();
      showToast(`${product.name} added to your bag.`);
      refreshDrawer();
      setDrawer(true);
      return;
    }
    const save = closest(event.target, '[data-wishlist]');
    if (save) {
      const saved = save.getAttribute('aria-pressed') === 'true';
      save.setAttribute('aria-pressed', String(!saved));
      save.classList.toggle('saved', !saved);
      showToast(saved ? 'Removed from saved pieces.' : 'Saved for later.');
      return;
    }
    const category = closest(event.target, '[data-category]');
    if (category) {
      const categoryValue = category.dataset.category;
      if (!categoryValue || !isCategory(categoryValue)) return;
      catalogState.category = categoryValue;
      document
        .querySelectorAll('[data-category]')
        .forEach((button) =>
          button.classList.toggle('active', button === category),
        );
      renderCatalog(catalogState);
      return;
    }
    const categoryLink = closest(event.target, '[data-category-link]');
    if (categoryLink) {
      const categoryValue = categoryLink.dataset.categoryLink;
      if (!categoryValue || !isCategory(categoryValue)) return;
      catalogState.category = categoryValue;
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
    const change = closest(event.target, '[data-quantity]');
    if (change) {
      const item = getCart().find(
        (entry) => entry.product.id === change.dataset.quantity,
      );
      if (!item) return;
      updateQuantity(
        item.product.id,
        item.quantity + Number(change.dataset.change),
      );
      renderRoute();
    }
    const remove = closest(event.target, '[data-remove]');
    if (remove) {
      const id = remove.dataset.remove;
      if (!id) return;
      removeFromCart(id);
      renderRoute();
    }
    const menu = closest(event.target, '.menu-button');
    if (menu) {
      const nav = document.querySelector('nav');
      if (!nav) return;
      const open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
    }
    const collections = closest(event.target, '.nav-collections');
    if (collections) {
      const nav = document.querySelector('nav');
      if (!nav) return;
      const open = nav.classList.toggle('collections-open');
      collections.setAttribute('aria-expanded', String(open));
    }
    if (closest(event.target, '[data-cart-toggle]')) {
      event.preventDefault();
      setDrawer(true);
    }
    if (closest(event.target, '.drawer-close, .drawer-scrim')) setDrawer(false);
    if (closest(event.target, '.search-link')) {
      location.hash = '#/shop';
      window.setTimeout(
        () =>
          (document.querySelector('#search') as HTMLElement | null)?.focus(),
        0,
      );
    }
    if (closest(event.target, '.account-link')) {
      showToast('Account sign-in is coming soon.');
    }
  });
  document.addEventListener('input', (event) => {
    if ((event.target as HTMLElement).id === 'search') {
      catalogState.term = (
        event.target as HTMLInputElement | HTMLSelectElement
      ).value;
      renderCatalog(catalogState);
    }
  });
  document.addEventListener('change', (event) => {
    if ((event.target as HTMLElement).id === 'sort') {
      const sort = (event.target as HTMLInputElement | HTMLSelectElement).value;
      if (!isCatalogSort(sort)) return;
      catalogState.sort = sort;
      renderCatalog(catalogState);
    }
  });
  document.addEventListener('submit', (event) => {
    if ((event.target as HTMLElement).id === 'newsletter-form') {
      event.preventDefault();
      (event.target as HTMLFormElement).reset();
      const newsletterMessage = document.querySelector<HTMLElement>(
        '.newsletter-message',
      );
      if (newsletterMessage)
        newsletterMessage.textContent = 'Thank you — you are on the list.';
      return;
    }
    if ((event.target as HTMLElement).id !== 'checkout-form') return;
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const result = validateCheckout(form);
    const message = form.querySelector<HTMLElement>('.form-message');
    if (!result.valid) {
      if (message) message.textContent = result.message;
      return;
    }
    clearCart();
    renderLayout(
      `<section class="page confirmation"><p class="eyebrow">Order confirmed</p><h1>Thank you, ${String(result.data.name).split(' ')[0]}.</h1><p>Your order has been placed. This is a simulated confirmation—no payment was processed.</p><a class="button" href="#/shop">Continue shopping <span>&rarr;</span></a></section>`,
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
  void loadProducts();
}

async function loadProducts() {
  renderCatalogStatus('Loading the collection.');
  try {
    const catalog = await fetchProducts();
    replaceCatalog(catalog.items, catalog.categories);
    if (!location.hash) location.hash = '#/';
    else renderRoute();
  } catch {
    renderCatalogStatus(
      'We could not load the collection. Please try again.',
      true,
    );
  }
}
