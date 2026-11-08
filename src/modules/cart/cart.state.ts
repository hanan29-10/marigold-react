import { MAX_CART_ITEM_QUANTITY, type Cart, type CartItem } from './cart.types';

const CART_KEY = 'marigold-cart';
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

function isValidCartItem(item: unknown): item is CartItem {
  if (!isRecord(item)) return false;
  return (
    typeof item.id === 'string' &&
    item.id.length > 0 &&
    typeof item.quantity === 'number' &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

/** Supports carts saved before items were reduced to an ID and quantity. */
function migrateCartItem(item: unknown): CartItem | undefined {
  if (isValidCartItem(item)) {
    return {
      ...item,
      quantity: Math.min(item.quantity, MAX_CART_ITEM_QUANTITY),
    };
  }
  if (
    isRecord(item) &&
    typeof item.productId === 'string' &&
    typeof item.quantity === 'number' &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  )
    return {
      id: item.productId,
      quantity: Math.min(item.quantity, MAX_CART_ITEM_QUANTITY),
    };
  if (!isRecord(item) || !isRecord(item.product)) return undefined;
  const { product, quantity } = item;
  if (
    typeof product.id !== 'string' ||
    product.id.length === 0 ||
    typeof quantity !== 'number' ||
    !Number.isInteger(quantity) ||
    quantity < 1
  )
    return undefined;
  return {
    id: product.id,
    quantity: Math.min(quantity, MAX_CART_ITEM_QUANTITY),
  };
}

function mergeCartItems(items: CartItem[]): Cart {
  return items.reduce<Cart>((cart, item) => {
    const existing = cart.find((cartItem) => cartItem.id === item.id);
    if (existing)
      existing.quantity = Math.min(
        existing.quantity + item.quantity,
        MAX_CART_ITEM_QUANTITY,
      );
    else cart.push({ ...item });
    return cart;
  }, []);
}

export function loadCart(): Cart {
  try {
    const storedCart: unknown = JSON.parse(
      localStorage.getItem(CART_KEY) || '[]',
    );
    if (!Array.isArray(storedCart)) return [];

    const cart = mergeCartItems(
      storedCart
        .map(migrateCartItem)
        .filter((item): item is CartItem => item !== undefined),
    );
    if (JSON.stringify(cart) !== JSON.stringify(storedCart)) saveCart(cart);
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
export function saveCart(cart: Cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    // Keep the cart in memory when private browsing or storage limits block saving.
  }
}
