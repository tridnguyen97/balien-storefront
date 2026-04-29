/**
 * useCart Hook
 *
 * React Query hooks for cart operations with automatic state synchronization.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getOrCreateCart,
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  updateCartShippingAddress,
  addShippingMethod,
  completeCart,
  deleteCart,
  Cart,
} from '../api/cart';

const CART_KEY = 'cart';

interface UseCartOptions {
  enabled?: boolean;
}

/**
 * Hook for managing cart with automatic persistence
 */
export function useCart(options: UseCartOptions = {}) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: [CART_KEY],
    queryFn: getOrCreateCart,
    staleTime: Infinity, // Cart should not go stale, updates handled via mutations
    enabled,
  });
}

/**
 * Hook for adding items to cart
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cartId,
      variantId,
      quantity,
    }: {
      cartId: string;
      variantId: string;
      quantity: number;
    }) => {
      return addItemToCart(cartId, variantId, quantity);
    },
    onSuccess: (data) => {
      // Update cache with new cart data
      queryClient.setQueryData([CART_KEY], data);
    },
  });
}

/**
 * Hook for updating cart item quantity
 */
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cartId,
      itemId,
      quantity,
    }: {
      cartId: string;
      itemId: string;
      quantity: number;
    }) => {
      return updateCartItem(cartId, itemId, quantity);
    },
    onSuccess: (data) => {
      queryClient.setQueryData([CART_KEY], data);
    },
  });
}

/**
 * Hook for removing items from cart
 */
export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cartId,
      itemId,
    }: {
      cartId: string;
      itemId: string;
    }) => {
      return removeCartItem(cartId, itemId);
    },
    onSuccess: (data) => {
      queryClient.setQueryData([CART_KEY], data);
    },
  });
}

/**
 * Hook for updating shipping address
 */
export function useUpdateShippingAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cartId,
      address,
    }: {
      cartId: string;
      address: Parameters<typeof updateCartShippingAddress>[1];
    }) => {
      return updateCartShippingAddress(cartId, address);
    },
    onSuccess: (data) => {
      queryClient.setQueryData([CART_KEY], data);
    },
  });
}

/**
 * Hook for adding shipping method
 */
export function useAddShippingMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cartId,
      optionId,
    }: {
      cartId: string;
      optionId: string;
    }) => {
      return addShippingMethod(cartId, optionId);
    },
    onSuccess: (data) => {
      queryClient.setQueryData([CART_KEY], data);
    },
  });
}

/**
 * Hook for completing checkout
 */
export function useCompleteCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cartId: string) => {
      return completeCart(cartId);
    },
    onSuccess: () => {
      // Clear cart cache after successful order
      queryClient.setQueryData([CART_KEY], null);
      queryClient.invalidateQueries({ queryKey: [CART_KEY] });
    },
  });
}

/**
 * Hook for clearing/deleting cart
 */
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cartId: string) => {
      return deleteCart(cartId);
    },
    onSuccess: () => {
      queryClient.setQueryData([CART_KEY], null);
      queryClient.invalidateQueries({ queryKey: [CART_KEY] });
    },
  });
}

/**
 * Hook for refreshing cart data
 */
export function useRefreshCart() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: [CART_KEY] });
  };
}

export type { Cart };
