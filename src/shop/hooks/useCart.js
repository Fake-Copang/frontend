import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  checkout,
} from '../api/cart';

export function useCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId) => addToCart(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });
}

export function useUpdateCartItemQuantity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cartItemId, quantity }) => updateCartItemQuantity(cartItemId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cartItemId) => removeCartItem(cartItemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });
}

export function useCheckout({ onSuccess, onInsufficientBalance } = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cartItemIds) => checkout(cartItemIds),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['savings'] });
      onSuccess?.(order);
    },
    onError: (err) => {
      if (err.response?.status === 400) onInsufficientBalance?.();
    },
  });
}