import { categories, products } from '../data/products.js';
import { hero } from '../components/hero.js';
import { productCard } from '../components/productCard.js';
import { getCatalog } from '../modules/products.js';
import { initMotion } from '../modules/motion.js';

const editorialRow = (title, eyebrow, items, className = '') =>
  `<section class="editorial-products ${className}"><div class="section-heading"><div><p class="eyebrow">${eyebrow}</p><h2>${title}</h2></div></div><div class="product-grid">${items.map(productCard).join('')}</div></section>`;

const signatureCarousel = (items) =>
  `<section class="editorial-products signature-carousel reveal" data-signature-carousel><div class="section-heading"><div><p class="eyebrow">The house codes</p><h2>Signature pieces</h2></div><div class="carousel-controls"><button type="button" data-carousel-previous aria-label="Previous signature pieces">←</button><button type="button" data-carousel-next aria-label="Next signature pieces">→</button></div></div><div class="signature-track">${items.map(productCard).join('')}</div></section>`;

export function homePage() {
  const signature = products
    .filter((product) => product.badge === 'Signature')
    .slice(0, 2);
  const arrivals = products
    .filter((product) => product.badge === 'New season')
    .slice(0, 2);
  const highlightedIds = [...signature, ...arrivals]
    .map((product) => product.id)
    .join(',');
  const categoryFilters = categories
    .map(
      (category) =>
        `<button type="button" data-category="${category}" class="${category === 'All' ? 'active' : ''}">${category}</button>`,
    )
    .join('');

  return `${hero()}<section class="benefits reveal" aria-label="MORON benefits"><p><b>&#10022;</b> Italian leather</p><p><b>&#9678;</b> Small-batch crafted</p><p><b>&#8981;</b> Complimentary delivery</p><p><b>&#9825;</b> Gift wrapping</p></section><section class="category-edit"><p class="eyebrow">A considered wardrobe</p><h2>Curated collections</h2><div class="category-grid"><a href="#/shop" class="category-tile tote" data-category-link="Totes"><span>Totes <b>→</b></span></a><a href="#/shop" class="category-tile shoulder" data-category-link="Shoulder Bags"><span>Shoulder bags <b>→</b></span></a><a href="#/shop" class="category-tile travel" data-category-link="Clutches"><span>Evening <b>→</b></span></a></div></section><section class="intro reveal"><p class="eyebrow">Designed to last</p><h2>Beautiful things,<br>made useful.</h2><p>Each MORON piece balances soft structure, considered function and materials selected to become more personal over time.</p></section>${signatureCarousel(signature)}<section class="catalog" id="shop"><div class="section-heading"><div><p class="eyebrow">The collection</p><h2>Featured pieces</h2></div><a href="#/shop" class="view-all">View all <span>→</span></a></div><div class="catalog-controls"><label>Search products<input id="search" type="search" placeholder="Search the collection"></label><label>Sort products<select id="sort"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A–Z</option></select></label></div><div class="filters" aria-label="Product categories">${categoryFilters}</div><div class="product-grid" data-exclude-products="${highlightedIds}"></div></section><section class="campaign"><div><p class="eyebrow">MORON journal / No. 04</p><h2>For every<br>way forward.</h2><p>Meet the soft leather pieces designed around a life in motion.</p><a href="#/shop" class="button button-light">Discover the story <span>→</span></a></div><div class="campaign-image" role="img" aria-label="MORON leather handbag campaign"></div></section>${editorialRow('New arrivals', 'Just arrived', arrivals, 'new-arrivals')}<section class="newsletter reveal"><p class="eyebrow">A note from MORON</p><h2>Keep in touch.</h2><p>Private previews, new arrivals, and stories from our studio.</p><form id="newsletter-form"><label class="sr-only" for="newsletter-email">Email address</label><input id="newsletter-email" type="email" placeholder="Email address" required><button class="button" type="submit">Subscribe <span>→</span></button></form><p class="newsletter-message" aria-live="polite"></p></section>`;
}

export function renderCatalog(state) {
  const grid = document.querySelector('.catalog .product-grid');
  const excludeIds = grid.dataset.excludeProducts.split(',').filter(Boolean);
  const catalog = getCatalog({ ...state, excludeIds });
  grid.innerHTML = catalog.length
    ? catalog.map(productCard).join('')
    : '<p class="empty">No products match your search.</p>';
  initMotion();
}
