export const money = (value) => `$${value.toFixed(2)}`;

export function productCard(product) {
  const secondaryImage = product.secondaryImage || product.image;
  return `<article class="product-card reveal"><div class="product-image"><a href="#/product/${product.id}" aria-label="View ${product.name}"><img class="product-image-primary" src="${product.image}" alt="${product.name}"><img class="product-image-secondary" src="${secondaryImage}" alt="" aria-hidden="true"></a><span>${product.badge}</span><button class="wishlist-button" type="button" data-wishlist="${product.id}" aria-label="Save ${product.name}" aria-pressed="false">♡</button><button class="quick-add" type="button" data-add="${product.id}">Quick add <span>+</span></button></div><div class="product-info"><p>${product.category}</p><h3><a href="#/product/${product.id}">${product.name}</a></h3><div class="product-meta"><strong>${money(product.price)}</strong><button class="text-button" type="button" data-add="${product.id}">Add to bag <span>→</span></button></div></div></article>`;
}
