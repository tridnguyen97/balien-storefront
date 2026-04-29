/**
 * Products API Module
 *
 * API functions for fetching products from Medusa backend.
 */

import medusaClient from './client';

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  thumbnail: string | null;
  images: { url: string }[];
  variants: ProductVariant[];
  options: ProductOption[];
  tags: { value: string }[];
  collection: { title: string } | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  price: number;
  original_price?: number;
  inventory_quantity: number;
  options: { value: string }[];
}

export interface ProductOption {
  id: string;
  title: string;
  values: { value: string }[];
}

export interface ProductsResponse {
  products: Product[];
  count: number;
  offset: number;
  limit: number;
}

export interface ProductResponse {
  product: Product;
}

interface FetchProductsParams {
  limit?: number;
  offset?: number;
  q?: string;
  category_id?: string[];
  collection_id?: string[];
}

/**
 * Fetch paginated list of products
 */
export async function fetchProducts(params: FetchProductsParams = {}): Promise<ProductsResponse> {
  const response = await medusaClient.get<ProductsResponse>('/products', {
    limit: params.limit || 20,
    offset: params.offset || 0,
    ...(params.q && { q: params.q }),
  });

  return response.data;
}

/**
 * Fetch a single product by handle
 */
export async function fetchProductByHandle(handle: string): Promise<ProductResponse> {
  const response = await medusaClient.get<ProductResponse>(`/products`, {
    handle,
  });

  // Note: Medusa returns an array when filtering by handle
  const products = response.data as unknown as { products: Product[] };
  if (!products.products?.length) {
    throw new Error(`Product with handle "${handle}" not found`);
  }

  return { product: products.products[0] };
}

/**
 * Fetch a single product by ID
 */
export async function fetchProductById(id: string): Promise<ProductResponse> {
  const response = await medusaClient.get<ProductResponse>(`/products/${id}`);
  return response.data;
}

/**
 * Search products by query
 */
export async function searchProducts(query: string): Promise<ProductsResponse> {
  return fetchProducts({ q: query });
}

/**
 * Get product categories/collections
 */
export async function fetchCollections(): Promise<{ collections: { id: string; title: string; handle: string }[] }> {
  const response = await medusaClient.get<{ collections: { id: string; title: string; handle: string }[] }>('/collections');
  return response.data;
}

/**
 * Transform Medusa product to app format
 */
export function transformProduct(product: Product): {
  id: string;
  title: string;
  handle: string;
  description: string;
  price: number;
  original_price: number | undefined;
  image: string;
  category: string;
  variants: ProductVariant[];
  options: ProductOption[];
  inventory: number;
} {
  const cheapestVariant = product.variants.reduce((min, variant) =>
    variant.price < min.price ? variant : min,
    product.variants[0]
  );

  const totalInventory = product.variants.reduce((sum, variant) =>
    sum + variant.inventory_quantity, 0
  );

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description,
    price: cheapestVariant?.price || 0,
    original_price: cheapestVariant?.original_price,
    image: product.thumbnail || product.images?.[0]?.url || '',
    category: product.collection?.title || product.tags?.[0]?.value || 'General',
    variants: product.variants,
    options: product.options,
    inventory: totalInventory,
  };
}
