import { useCallback, useEffect, useState } from 'react';
import { fetchProducts } from './products.api';
import {
  isProductCategory,
  type Product,
  type ProductCategory,
} from './products.types';
interface ProductsState {
  products: Product[];
  categories: Array<ProductCategory | 'All'>;
  loading: boolean;
  error: boolean;
  reload: () => void;
}
export function useProducts(): ProductsState {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<ProductCategory | 'All'>>([
    'All',
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const reload = useCallback(() => {
    setLoading(true);
    setError(false);
    void fetchProducts()
      .then((response) => {
        setProducts(response.items);
        setCategories([
          'All',
          ...response.categories.filter(isProductCategory),
        ]);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    reload();
  }, [reload]);
  return { products, categories, loading, error, reload };
}
