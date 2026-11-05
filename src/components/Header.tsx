import { useEffect, useState } from 'react';
import { getCartCount } from '../features/cart/cart.logic';
import { useCart } from '../features/cart/CartProvider';
import type { ProductCategory } from '../features/products/products.types';
import { navigate } from '../shared/useHashRoute';

const navigationCollections: ProductCategory[] = [
  'Totes',
  'Shoulder Bags',
  'Clutches',
];

export interface HeaderProps {
  onBagOpen: () => void;
}

export function Header({ onBagOpen }: HeaderProps) {
  const { cart } = useCart();
  const [menu, setMenu] = useState(false);
  const [collections, setCollections] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 12);

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  const selectCollection = (category: string) => {
    sessionStorage.setItem('marigold-category', category);
    setMenu(false);
    setCollections(false);
  };
  return (
    <>
      <div className="announcement-bar" hidden>
        <span>New Season — The Autumn Edit 2026</span>
        <span className="announcement-brand">
          <i />
          MARIGOLD
          <i />
        </span>
        <span>
          Worldwide Shipping <em>|</em> Free Returns
        </span>
      </div>
      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <div className="main-navbar">
          <a className="brand" href="#/">
            MARIGOLD <small>leather goods</small>
          </a>
          <button
            className="menu-button"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menu}
            onClick={() => setMenu((isOpen) => !isOpen)}
          >
            <span />
            <span />
            <b>Menu</b>
          </button>
          <nav
            className={`${menu ? 'open ' : ''}${collections ? 'collections-open' : ''}`}
            aria-label="Main navigation"
          >
            <a href="#/" onClick={() => setMenu(false)}>
              Home
            </a>
            <a href="#/shop" onClick={() => setMenu(false)}>
              Shop all
            </a>
            <a href="#/shop" onClick={() => setMenu(false)}>
              New in
            </a>
            <button
              className="nav-collections"
              type="button"
              aria-expanded={collections}
              onClick={() => setCollections((isOpen) => !isOpen)}
            >
              <span className="nav-label">Collections</span>
              <span className="nav-plus">+</span>
            </button>
            <div className="nav-dropdown">
              {navigationCollections.map((category) => (
                <a
                  key={category}
                  href="#/shop"
                  onClick={() => selectCollection(category)}
                >
                  {category}
                </a>
              ))}
            </div>
            <a href="#/" onClick={() => setMenu(false)}>
              About
            </a>
          </nav>
          <div className="header-actions">
            <button
              className="header-icon search-link"
              type="button"
              aria-label="Search products"
              onClick={() => navigate('/shop')}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="10.8" cy="10.8" r="6.6" />
                <path d="m16 16 4.3 4.3" />
              </svg>
            </button>
            <button
              className="header-icon"
              type="button"
              aria-label="View saved pieces"
              onClick={() => navigate('/wishlist')}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.8 8.5c0 5.3-8.8 10.8-8.8 10.8S3.2 13.8 3.2 8.5A4.8 4.8 0 0 1 12 5.8a4.8 4.8 0 0 1 8.8 2.7Z" />
              </svg>
            </button>
            <button
              className="cart-link"
              type="button"
              onClick={onBagOpen}
              aria-label="Open shopping bag"
            >
              <span>Bag</span>
              <b className="cart-count">{getCartCount(cart)}</b>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
