import './style.css';
import heroBag from './assets/pink-handbag.png';
import { categories, products } from './data/products.js';

const app = document.querySelector('#app');
let activeCategory = 'All';
let searchTerm = '';
let cartCount = 0;
const savedItems = new Set();
const productCard = (p) =>
  `<article class="product-card"><div class="product-photo"><img src="${p.image}" alt="${p.name}" loading="lazy"><span>${p.badge}</span><button class="save-button ${savedItems.has(p.id) ? 'is-saved' : ''}" type="button" data-save="${p.id}" aria-label="Save ${p.name}" aria-pressed="${savedItems.has(p.id)}">♡</button><button class="quick-add" type="button" data-add="${p.id}">Add to bag</button></div><div class="product-details"><div><p>${p.category}</p><h3>${p.name}</h3></div><strong>$${p.price}</strong></div></article>`;
function renderProducts() {
  const visible = products.filter(
    (p) =>
      (activeCategory === 'All' || p.category === activeCategory) &&
      p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  document.querySelector('.product-grid').innerHTML = visible.length
    ? visible.map(productCard).join('')
    : '<p class="empty-state">No pieces found. Try a different search.</p>';
}

app.innerHTML = `<div class="announcement">Complimentary delivery on orders over $200 <span>•</span> Crafted for your every day</div><header class="site-header"><a class="wordmark" href="#top" aria-label="Aurum home">AURUM</a><nav aria-label="Main navigation"><a href="#shop">Shop</a><a href="#edit">The Edit</a><a href="#story">Our Story</a></nav><div class="header-actions"><button class="search-toggle" type="button" aria-label="Open product search">⌕</button><button class="bag-button" type="button" aria-label="Shopping bag, 0 items">Bag <b>0</b></button><button class="menu-toggle" type="button" aria-label="Toggle navigation">☰</button></div></header><main id="top"><section class="hero" aria-labelledby="hero-title"><div class="hero-copy"><p class="eyebrow">The autumn collection / 2026</p><h1 id="hero-title">Objects of <em>desire.</em></h1><p class="hero-description">Small luxuries, beautifully made. Discover accessories designed to become part of your signature.</p><a class="button button-light" href="#shop">Explore the collection <span>→</span></a></div><div class="hero-art"><img src="${heroBag}" alt="Sculptural pink handbag against a warm backdrop"><p>01 / 04</p></div></section><section class="values" aria-label="Aurum values"><p>Italian leather &amp; considered materials</p><p>Designed in small, thoughtful batches</p><p>Gift wrapping, always on us</p></section><section class="shop-section" id="shop" aria-labelledby="shop-title"><div class="section-heading"><div><p class="eyebrow">Curated by Aurum</p><h2 id="shop-title">The shopboard</h2></div><p class="product-count">${products.length} collectible pieces</p></div><div class="shop-controls"><div class="category-list" role="tablist" aria-label="Product categories">${categories.map((c) => `<button type="button" role="tab" aria-selected="${c === 'All'}" data-category="${c}">${c}</button>`).join('')}</div><label class="search-field" for="product-search"><span>Search</span><input id="product-search" type="search" placeholder="Find a piece"></label></div><div class="product-grid">${products.map(productCard).join('')}</div></section><section class="editorial" id="edit" aria-labelledby="edit-title"><div class="editorial-image"></div><div class="editorial-copy"><p class="eyebrow">Aurum journal / No. 08</p><h2 id="edit-title">The art of the finishing touch.</h2><p>Our accessories are the punctuation marks of a personal style story: vivid, intentional, and never accidental.</p><a class="text-link" href="#story">Read the journal <span>→</span></a></div></section><section class="newsletter" id="story" aria-labelledby="newsletter-title"><p class="eyebrow">Private access</p><h2 id="newsletter-title">A note from Aurum.</h2><p>New arrivals, private previews, and stories worth keeping.</p><form><label class="sr-only" for="email">Email address</label><input id="email" type="email" placeholder="Your email address" required><button class="button" type="submit">Subscribe <span>→</span></button></form><p class="form-message" aria-live="polite"></p></section></main><footer><a class="wordmark" href="#top">AURUM</a><p>Luxury, in the details.</p><p>© 2026 Aurum Atelier</p></footer>`;
document.addEventListener('click', (e) => {
  const c = e.target.closest('[data-category]');
  if (c) {
    activeCategory = c.dataset.category;
    document
      .querySelectorAll('[data-category]')
      .forEach((b) => b.setAttribute('aria-selected', String(b === c)));
    renderProducts();
  }
  const s = e.target.closest('[data-save]');
  if (s) {
    const { save: id } = s.dataset;
    savedItems.has(id) ? savedItems.delete(id) : savedItems.add(id);
    s.classList.toggle('is-saved');
    s.setAttribute('aria-pressed', String(savedItems.has(id)));
  }
  if (e.target.closest('[data-add]')) {
    cartCount += 1;
    document.querySelector('.bag-button b').textContent = cartCount;
  }
  if (e.target.closest('.menu-toggle'))
    document.querySelector('nav').classList.toggle('is-open');
  if (e.target.closest('.search-toggle'))
    document.querySelector('#product-search').focus();
});
document.querySelector('#product-search').addEventListener('input', (e) => {
  searchTerm = e.target.value;
  renderProducts();
});
document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  e.currentTarget.reset();
  document.querySelector('.form-message').textContent =
    'Thank you — your private note is on its way.';
});
