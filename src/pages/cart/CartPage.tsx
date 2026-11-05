import { useCart } from '../../features/cart/CartProvider';
import { getCartTotal } from '../../features/cart/cart.logic';
import { money } from '../../features/products/products.format';
import { CartItems } from './components/CartItems';
export function CartPage() {
  const { cart, clear } = useCart();
  return (
    <section className="page">
      <p className="eyebrow">Your selection</p>
      <h1>Shopping bag</h1>
      {cart.length ? (
        <div className="cart-layout">
          <CartItems />
          <aside className="summary">
            <h2>Order summary</h2>
            <div>
              <span>Subtotal</span>
              <strong>{money(getCartTotal(cart))}</strong>
            </div>
            <p>Shipping is calculated at checkout.</p>
            <a className="button" href="#/checkout">
              Checkout <span>→</span>
            </a>
            <button className="button button-secondary" onClick={clear}>
              Clear bag
            </button>
          </aside>
        </div>
      ) : (
        <p className="empty">
          Your bag is empty. <a href="#/shop">Explore the collection.</a>
        </p>
      )}
    </section>
  );
}
