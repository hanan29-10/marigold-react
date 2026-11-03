import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateQuantity,
} from '../modules/cart';
import { categories, isProductCategory, products } from '../modules/products';
import { validateCheckout } from './checkout';
import { showToast } from '../shared/ui';
import { refreshCartCount } from './header.ui';
import { renderCatalog } from './home';
import type {
  CatalogSort,
  CatalogState,
  ProductCategory,
} from '../modules/products';

interface ApplicationEvents {
  catalogState: CatalogState;
  loadProducts: () => Promise<void>;
  refreshDrawer: () => void;
  renderLayout: (content: string) => void;
  renderRoute: () => void;
  setDrawer: (open: boolean) => void;
}

const isCategory = (value: string): value is ProductCategory | 'All' =>
  categories.some((category) => category === value) &&
  (value === 'All' || isProductCategory(value));
const isCatalogSort = (value: string): value is CatalogSort =>
  ['featured', 'price-low', 'price-high', 'name'].some(
    (sort) => sort === value,
  );
const closest = (
  target: EventTarget | null,
  selector: string,
): HTMLElement | null => {
  const match = target instanceof Element ? target.closest(selector) : null;
  return match instanceof HTMLElement ? match : null;
};
const isFormControl = (
  value: EventTarget | null,
): value is HTMLInputElement | HTMLSelectElement =>
  value instanceof HTMLInputElement || value instanceof HTMLSelectElement;
const isForm = (value: EventTarget | null): value is HTMLFormElement =>
  value instanceof HTMLFormElement;

export function bindApplicationEvents({
  catalogState,
  loadProducts,
  refreshDrawer,
  renderLayout,
  renderRoute,
  setDrawer,
}: ApplicationEvents) {
  document.addEventListener('click', (event) => {
    if (closest(event.target, '[data-retry-products]')) {
      void loadProducts();
      return;
    }
    const add = closest(event.target, '[data-add]');
    if (add) {
      const product = products.find((item) => item.id === add.dataset.add);
      const quantitySelect = document.querySelector('#quantity');
      const quantity = add.hasAttribute('data-detail-add')
        ? Number(
            quantitySelect instanceof HTMLSelectElement
              ? quantitySelect.value
              : '1',
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
      window.setTimeout(() => {
        const searchInput = document.querySelector('#search');
        if (searchInput instanceof HTMLElement) searchInput.focus();
      }, 0);
    }
    if (closest(event.target, '.account-link')) {
      showToast('Account sign-in is coming soon.');
    }
  });
  document.addEventListener('input', (event) => {
    if (isFormControl(event.target) && event.target.id === 'search') {
      catalogState.term = event.target.value;
      renderCatalog(catalogState);
    }
  });
  document.addEventListener('change', (event) => {
    if (isFormControl(event.target) && event.target.id === 'sort') {
      const sort = event.target.value;
      if (!isCatalogSort(sort)) return;
      catalogState.sort = sort;
      renderCatalog(catalogState);
    }
  });
  document.addEventListener('submit', (event) => {
    if (isForm(event.target) && event.target.id === 'newsletter-form') {
      event.preventDefault();
      event.target.reset();
      const newsletterMessage = document.querySelector('.newsletter-message');
      if (newsletterMessage instanceof HTMLElement)
        newsletterMessage.textContent = 'Thank you — you are on the list.';
      return;
    }
    if (!isForm(event.target) || event.target.id !== 'checkout-form') return;
    event.preventDefault();
    const result = validateCheckout(event.target);
    const message = event.target.querySelector('.form-message');
    if (!result.valid) {
      if (message instanceof HTMLElement) message.textContent = result.message;
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
}
