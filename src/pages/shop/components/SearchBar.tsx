import {
  isCatalogSort,
  type CatalogSort,
} from '../../../features/products/products.types';

export interface SearchBarProps {
  term: string;
  sort: CatalogSort;
  onTermChange: (value: string) => void;
  onSortChange: (value: CatalogSort) => void;
}
export function SearchBar({
  term,
  sort,
  onTermChange,
  onSortChange,
}: SearchBarProps) {
  return (
    <div className="catalog-controls">
      <label>
        Search products
        <input
          type="search"
          value={term}
          placeholder="Search the collection"
          onChange={(event) => onTermChange(event.target.value)}
        />
      </label>
      <label>
        Sort products
        <select
          value={sort}
          onChange={(event) => {
            if (isCatalogSort(event.target.value))
              onSortChange(event.target.value);
          }}
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
          <option value="name">Name: A–Z</option>
        </select>
      </label>
    </div>
  );
}
