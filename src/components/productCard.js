export const money = (value) => `$${value.toFixed(2)}`;

export function productCard(product) {
  return `<article class="product-card"><div class="product-image"><a href="#/product/${product.id}"><img src="${product.image}" alt="${product.name}"></a><span>${product.badge}</span><button class="wishlist-button" type="button" aria-label="Save ${product.name}">&#9825;</button></div><div class="product-info"><p>${product.category}</p><h3><a href="#/product/${product.id}">${product.name}</a></h3><strong>${money(product.price)}</strong><button class="text-button" type="button" data-add="${product.id}">Add to bag <span>&rarr;</span></button></div></article>`;
}
