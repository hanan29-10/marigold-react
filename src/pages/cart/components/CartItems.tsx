import { useCart } from '../../../modules/cart/CartProvider';
import { MAX_CART_ITEM_QUANTITY } from '../../../modules/cart/cart.types';
import { money } from '../../../modules/products/products.format';
export function CartItems() {
  const { items, remove, update } = useCart();
  return (
    <ul className="cart-list">
      {items.map(({ product, quantity }) => (
        <li key={product.id}>
          <img src={product.image} alt="" />
          <div>
            <h2>{product.name}</h2>
            <p>{money(product.price)}</p>
            <div className="quantity-actions">
              <button
                onClick={() => update(product.id, quantity - 1)}
                aria-label={`Decrease ${product.name} quantity`}
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => update(product.id, quantity + 1)}
                aria-label={`Increase ${product.name} quantity`}
                disabled={quantity === MAX_CART_ITEM_QUANTITY}
              >
                +
              </button>
              <button onClick={() => remove(product.id)}>Remove</button>
            </div>
          </div>
          <strong>{money(product.price * quantity)}</strong>
        </li>
      ))}
    </ul>
  );
}
