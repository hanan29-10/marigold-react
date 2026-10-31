import { getCart, getCartTotal } from '../modules/cart.js';
import { money } from './productCard.js';

export function cartDrawer() {
  const cart = getCart();
  const items = cart.length
    ? cart
        .map(
          ({ product, quantity }) =>
            `<li><img src="${product.image}" alt=""><div><p>${product.name}</p><small>Qty ${quantity}</small></div><strong>${money(product.price * quantity)}</strong></li>`,
        )
        .join('')
    : '<li class="drawer-empty">Your bag is waiting for its first piece.</li>';
  return `<aside class="cart-drawer" aria-label="Shopping bag" aria-hidden="true"><div class="drawer-heading"><p class="eyebrow">Your selection</p><button type="button" class="drawer-close" aria-label="Close shopping bag">×</button></div><h2>Shopping bag</h2><ul>${items}</ul><div class="drawer-footer"><p><span>Subtotal</span><strong>${money(getCartTotal())}</strong></p><a class="button" href="#/cart">View bag <span>→</span></a></div></aside><button class="drawer-scrim" type="button" aria-label="Close shopping bag" tabindex="-1"></button>`;
}
