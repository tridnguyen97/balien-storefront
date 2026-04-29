/**
 * Cart API Module
 *
 * API functions for cart operations with Medusa backend.
 */

import medusaClient from './client';

export interface Cart {
  id: string;
  items: CartItem[];
  region_id: string | null;
  email: string | null;
  shipping_address: Address | null;
  billing_address: Address | null;
  shipping_methods: ShippingMethod[];
  payment_session: PaymentSession | null;
  subtotal: number;
  shipping_total: number;
  tax_total: number;
  discount_total: number;
  total: number;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  quantity: number;
  unit_price: number;
  original_price?: number;
  total: number;
  variant: {
    id: string;
    title: string;
    sku: string;
    options: { value: string }[];
  };
}

export interface Address {
  id?: string;
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  country_code: string;
  province?: string;
  postal_code: string;
  phone?: string;
}

export interface ShippingMethod {
  id: string;
  shipping_option_id: string;
  name: string;
  amount: number;
}

export interface PaymentSession {
  id: string;
  provider_id: string;
  is_selected?: boolean;
  status: string;
}

export interface CreateCartRequest {
  region_id?: string;
}

export interface AddToCartRequest {
  variant_id: string;
  quantity: number;
  metadata?: Record<string, unknown>;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface UpdateCartAddressRequest {
  shipping_address?: Partial<Address>;
  billing_address?: Partial<Address>;
}

export interface AddShippingMethodRequest {
  option_id: string;
}

export interface CompleteCartResponse {
  data: {
    order: {
      id: string;
      status: string;
      display_id: string;
      total: number;
      created_at: string;
    };
  };
}

/**
 * Create a new cart
 */
export async function createCart(regionId?: string): Promise<{ cart: Cart }> {
  const body: CreateCartRequest = {};
  if (regionId) {
    body.region_id = regionId;
  }

  const response = await medusaClient.post<{ cart: Cart }>('/carts', body);

  // Store cart ID in localStorage for session persistence
  if (response.data.cart.id) {
    localStorage.setItem('cart_id', response.data.cart.id);
  }

  return response.data;
}

/**
 * Get cart by ID
 */
export async function getCart(cartId: string): Promise<{ cart: Cart }> {
  const response = await medusaClient.get<{ cart: Cart }>(`/carts/${cartId}`);
  return response.data;
}

/**
 * Get or create cart (for session management)
 */
export async function getOrCreateCart(): Promise<{ cart: Cart }> {
  const existingCartId = localStorage.getItem('cart_id');

  if (existingCartId) {
    try {
      const cart = await getCart(existingCartId);
      return cart;
    } catch (error) {
      // Cart expired or invalid, create new one
      console.log('Existing cart invalid, creating new one');
    }
  }

  return createCart();
}

/**
 * Add item to cart
 */
export async function addItemToCart(
  cartId: string,
  variantId: string,
  quantity: number
): Promise<{ cart: Cart }> {
  const response = await medusaClient.post<{ cart: Cart }>(
    `/carts/${cartId}/line-items`,
    {
      variant_id: variantId,
      quantity,
    }
  );
  return response.data;
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(
  cartId: string,
  itemId: string,
  quantity: number
): Promise<{ cart: Cart }> {
  const response = await medusaClient.update<{ cart: Cart }>(
    `/carts/${cartId}/line-items/${itemId}`,
    { quantity }
  );
  return response.data;
}

/**
 * Remove item from cart
 */
export async function removeCartItem(
  cartId: string,
  itemId: string
): Promise<{ cart: Cart }> {
  const response = await medusaClient.delete<{ cart: Cart }>(
    `/carts/${cartId}/line-items/${itemId}`
  );
  return response.data;
}

/**
 * Update cart shipping address
 */
export async function updateCartShippingAddress(
  cartId: string,
  address: Partial<Address>
): Promise<{ cart: Cart }> {
  const response = await medusaClient.update<{ cart: Cart }>(
    `/carts/${cartId}`,
    { shipping_address: address }
  );
  return response.data;
}

/**
 * Update cart billing address
 */
export async function updateCartBillingAddress(
  cartId: string,
  address: Partial<Address>
): Promise<{ cart: Cart }> {
  const response = await medusaClient.update<{ cart: Cart }>(
    `/carts/${cartId}`,
    { billing_address: address }
  );
  return response.data;
}

/**
 * Add shipping method to cart
 */
export async function addShippingMethod(
  cartId: string,
  optionId: string
): Promise<{ cart: Cart }> {
  const response = await medusaClient.post<{ cart: Cart }>(
    `/carts/${cartId}/shipping-methods`,
    { option_id: optionId }
  );
  return response.data;
}

/**
 * Complete cart (create order)
 */
export async function completeCart(cartId: string): Promise<CompleteCartResponse> {
  const response = await medusaClient.post<CompleteCartResponse['data']>(
    `/carts/${cartId}/complete`
  );

  // Clear cart ID after successful order
  localStorage.removeItem('cart_id');

  return { data: response.data };
}

/**
 * Get available shipping options for cart
 */
export async function getShippingOptions(
  cartId: string
): Promise<{ shipping_options: { id: string; name: string; amount: number; }[] }> {
  const response = await medusaClient.get<{ shipping_options: { id: string; name: string; amount: number; }[] }>(
    `/shipping-options/${cartId}`
  );
  return response.data;
}

/**
 * Delete cart
 */
export async function deleteCart(cartId: string): Promise<void> {
  await medusaClient.delete(`/carts/${cartId}`);
  localStorage.removeItem('cart_id');
}
