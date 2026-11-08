import { useEffect, useState } from 'react';
import { UserRound } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router';
import { getCartCount } from '../../modules/cart/cart.logic';
import { useCart } from '../../modules/cart/CartProvider';
import type { ProductCategory } from '../../modules/products/products.types';

const navigationCollections: ProductCategory[] = [
  'Totes',
  'Shoulder Bags',
  'Clutches',
];

export interface HeaderProps {
  onBagOpen: () => void;
}

export function Header({ onBagOpen }: HeaderProps) {
  const navigate = useNavigate();
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
          <Link className="brand" to="/">
            MARIGOLD <small>leather goods</small>
          </Link>
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
            <NavLink to="/" onClick={() => setMenu(false)}>
              Home
            </NavLink>
            <NavLink to="/shop" onClick={() => setMenu(false)}>
              Shop all
            </NavLink>
            <NavLink to="/shop" onClick={() => setMenu(false)}>
              New in
            </NavLink>
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
                <Link
                  key={category}
                  to="/shop"
                  onClick={() => selectCollection(category)}
                >
                  {category}
                </Link>
              ))}
            </div>
            <NavLink to="/" onClick={() => setMenu(false)}>
              About
            </NavLink>
            <NavLink
              className="mobile-sign-in"
              to="/login"
              onClick={() => setMenu(false)}
            >
              Sign in
            </NavLink>
          </nav>
          <div className="header-actions">
            <button
              className="header-icon search-link"
              type="button"
              aria-label="Search products"
              onClick={() => {
                void navigate('/shop');
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="10.8" cy="10.8" r="6.6" />
                <path d="m16 16 4.3 4.3" />
              </svg>
            </button>
            <Link
              className="sign-in-link"
              to="/login"
              aria-label="Open sign in page"
            >
              <UserRound aria-hidden="true" />
              <span>Sign in</span>
            </Link>
            <button
              className="header-icon"
              type="button"
              aria-label="View saved pieces"
              onClick={() => {
                void navigate('/wishlist');
              }}
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
