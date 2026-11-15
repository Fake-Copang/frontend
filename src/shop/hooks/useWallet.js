import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchWallet, checkIn, chargeWallet } from '../api/wallet';

export function useWallet() {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: fetchWallet,
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: checkIn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wallet'] }),
  });
}

export function useChargeWallet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount) => chargeWallet(amount),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wallet'] }),
  });
}