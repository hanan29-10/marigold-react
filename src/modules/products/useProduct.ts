import { useCallback, useEffect, useState } from 'react';
import { isApiNotFoundError } from '../../shared/apiClient';
import { getProductById } from './products.api';
import type { Product } from './products.types';

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const reload = useCallback(() => {
    setLoading(true);
    setError(false);
    setNotFound(false);
    void getProductById(id)
      .then(setProduct)
      .catch((requestError: unknown) => {
        setProduct(undefined);
        if (isApiNotFoundError(requestError)) setNotFound(true);
        else setError(true);
      })
      .finally(() => setLoading(false));
  }, [id]);
  useEffect(() => reload(), [reload]);
  return { product, loading, error, notFound, reload };
}
