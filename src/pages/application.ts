import { cartDrawer } from '../modules/cart';
import {
  fetchProducts,
  findProduct,
  replaceCatalog,
} from '../modules/products';
import { footer } from './footer.ui';
import { header } from './header.ui';
import { startCarousel } from './hero.ui';
import { cartPage } from './cart';
import { checkoutPage } from './checkout';
import { bindApplicationEvents } from './application.events';
import { homePage, renderCatalog } from './home';
import { initMotion, initSignatureCarousel } from './motion';
import { productDetailsPage } from './product';
import type { CatalogState } from '../modules/products';

const app = document.querySelector('#app');
const catalogState: CatalogState = {
  category: 'All',
  term: '',
  sort: 'featured',
};
let carouselTimer: ReturnType<typeof window.setInterval> | undefined;

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

export function startApplication() {
  bindApplicationEvents({
    catalogState,
    loadProducts,
    refreshDrawer,
    renderLayout,
    renderRoute,
    setDrawer,
  });
  void loadProducts();
}
