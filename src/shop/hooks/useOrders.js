import { useQuery } from '@tanstack/react-query';
import { fetchOrders } from '../api/orders';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    refetchInterval: 60 * 1000, // 1분마다 다시 불러와서 배송 상태 변화를 반영
  });
}