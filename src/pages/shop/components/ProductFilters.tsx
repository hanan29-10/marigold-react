import type { ProductCategory } from '../../../features/products/products.types';
export interface ProductFiltersProps {
  categories: Array<ProductCategory | 'All'>;
  selected: ProductCategory | 'All';
  onSelect: (category: ProductCategory | 'All') => void;
}
export function ProductFilters({
  categories,
  selected,
  onSelect,
}: ProductFiltersProps) {
  return (
    <div className="filters" aria-label="Product categories">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={category === selected ? 'active' : ''}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
