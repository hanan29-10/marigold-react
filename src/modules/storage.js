const CART_KEY = 'shopboard-cart';

function isValidCartItem(item) {
  return (
    item &&
    typeof item === 'object' &&
    item.product &&
    typeof item.product.id === 'string' &&
    typeof item.product.name === 'string' &&
    Number.isFinite(item.product.price) &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

export function loadCart() {
  try {
    const storedCart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    if (!Array.isArray(storedCart)) return [];

    const cart = storedCart.filter(isValidCartItem);
    if (cart.length !== storedCart.length) saveCart(cart);
    return cart;
  } catch {
    try {
      localStorage.removeItem(CART_KEY);
    } catch {
      // The bag can still work for this visit if browser storage is unavailable.
    }
    return [];
  }
}
export function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    // Keep the cart in memory when private browsing or storage limits block saving.
  }
}
