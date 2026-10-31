export const searchProducts = (products, term) =>
  products.filter((product) =>
    product.name.toLowerCase().includes(term.trim().toLowerCase()),
  );
