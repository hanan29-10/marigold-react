import { useEffect } from 'react';
import { getCartTotal } from '../cart.logic';
import { money } from '../../products/products.format';
import { useCart } from '../CartProvider';
export interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}
export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items } = useCart();
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onClose, open]);

  return (
    <>
      <aside
        className={`cart-drawer ${open ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        aria-hidden={!open}
      >
        <div className="drawer-heading">
          <p className="eyebrow">Your selection</p>
          <button
            type="button"
            className="drawer-close"
            onClick={onClose}
            aria-label="Close shopping bag"
          >
            ×
          </button>
        </div>
        <h2>Shopping bag</h2>
        <ul>
          {items.length ? (
            items.map(({ product, quantity }) => (
              <li key={product.id}>
                <img src={product.image} alt="" />
                <div>
                  <p>{product.name}</p>
                  <small>Qty {quantity}</small>
                </div>
                <strong>{money(product.price * quantity)}</strong>
              </li>
            ))
          ) : (
            <li className="drawer-empty">
              Your bag is waiting for its first piece.
            </li>
          )}
        </ul>
        <div className="drawer-footer">
          <p>
            <span>Subtotal</span>
            <strong>{money(getCartTotal(items))}</strong>
          </p>
          <a className="button" href="/cart" onClick={onClose}>
            View bag <span>→</span>
          </a>
        </div>
      </aside>
      <button
        className={`drawer-scrim ${open ? 'open' : ''}`}
        type="button"
        onClick={onClose}
        aria-label="Close shopping bag"
        tabIndex={-1}
      />
    </>
  );
}
