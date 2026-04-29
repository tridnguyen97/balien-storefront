/**
 * useProducts Hook
 *
 * React Query hook for fetching and managing products.
 */

import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { fetchProducts, fetchProductByHandle, searchProducts, transformProduct, Product } from '../api/products';

const PRODUCTS_KEY = 'products';
const PRODUCT_KEY = 'product';

interface UseProductsOptions {
  limit?: number;
  offset?: number;
  enabled?: boolean;
}

interface UseProductOptions {
  enabled?: boolean;
}

/**
 * Hook for fetching paginated products
 */
export function useProducts(options: UseProductsOptions = {}) {
  const { limit = 20, offset = 0, enabled = true } = options;

  return useQuery({
    queryKey: [PRODUCTS_KEY, { limit, offset }],
    queryFn: () => fetchProducts({ limit, offset }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled,
  });
}

/**
 * Hook for fetching a single product by handle
 */
export function useProduct(handle: string, options: UseProductOptions = {}) {
  const { enabled = !!handle } = options;

  return useQuery({
    queryKey: [PRODUCT_KEY, handle],
    queryFn: () => fetchProductByHandle(handle),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled,
  });
}

/**
 * Hook for searching products
 */
export function useProductSearch(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: [PRODUCTS_KEY, 'search', query],
    queryFn: () => searchProducts(query),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: enabled && query.length > 0,
  });
}

/**
 * Hook for prefetching product (useful for product lists)
 */
export function usePrefetchProduct() {
  const queryClient = useQueryClient();

  return (handle: string) => {
    queryClient.prefetchQuery({
      queryKey: [PRODUCT_KEY, handle],
      queryFn: () => fetchProductByHandle(handle),
      staleTime: 10 * 60 * 1000,
    });
  };
}

/**
 * Hook for invalidating products cache
 */
export function useInvalidateProducts() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] }),
    invalidateProduct: (handle: string) => queryClient.invalidateQueries({ queryKey: [PRODUCT_KEY, handle] }),
  };
}

export type { Product };
