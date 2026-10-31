export const filterByCategory = (products, category) =>
  category === 'All'
    ? products
    : products.filter((product) => product.category === category);
