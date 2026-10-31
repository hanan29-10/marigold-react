export function sortProducts(products, order) {
  const sorted = [...products];
  if (order === 'price-low') return sorted.sort((a, b) => a.price - b.price);
  if (order === 'price-high') return sorted.sort((a, b) => b.price - a.price);
  if (order === 'name')
    return sorted.sort((a, b) => a.name.localeCompare(b.name));
  return sorted;
}
