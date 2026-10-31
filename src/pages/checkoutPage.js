import { getCart, getCartTotal } from '../modules/cart.js';
import { money } from '../components/productCard.js';
export function checkoutPage() {
  const cart = getCart();
  if (!cart.length)
    return '<section class="page"><h1>Your bag is empty</h1><a href="#/shop">Go shopping</a></section>';
  return `<section class="page checkout"><div><p class="eyebrow">Secure checkout</p><h1>Your details</h1><form id="checkout-form" novalidate><label for="name">Full name<input id="name" name="name" autocomplete="name" required></label><label for="email">Email address<input id="email" name="email" type="email" autocomplete="email" required></label><label for="address">Address<input id="address" name="address" autocomplete="street-address" required></label><label for="city">City<input id="city" name="city" autocomplete="address-level2" required></label><p class="form-message" role="alert"></p><button class="button" type="submit">Place simulated order <span>&rarr;</span></button></form></div><aside class="summary"><h2>Order summary</h2>${cart.map(({ product, quantity }) => `<p>${product.name} × ${quantity} <strong>${money(product.price * quantity)}</strong></p>`).join('')}<div><span>Total</span><strong>${money(getCartTotal())}</strong></div></aside></section>`;
}
