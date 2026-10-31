import { money } from '../components/productCard.js';
export function productDetailsPage(product) {
  if (!product)
    return '<section class="page"><h1>Product not found</h1><a href="#/shop">Return to shop</a></section>';
  return `<section class="page product-detail"><a class="back" href="#/shop">← Back to shop</a><img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85'"><div><p class="eyebrow">${product.category}</p><h1>${product.name}</h1><strong class="price">${money(product.price)}</strong><p>${product.description}</p><label class="quantity-label" for="quantity">Quantity <select id="quantity"><option>1</option><option>2</option><option>3</option><option>4</option></select></label><button class="button" type="button" data-add="${product.id}" data-detail-add>Add to bag <span>→</span></button></div></section>`;
}
