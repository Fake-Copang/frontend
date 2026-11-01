import { useQuery } from '@tanstack/react-query';
import {
  fetchFurnitureProducts,
  fetchProductById,
  searchFurnitureProducts,
} from '../api/products';

export function useFurnitureProducts() {
  return useQuery({
    queryKey: ['products', 'furniture'],
    queryFn: fetchFurnitureProducts,
    staleTime: 5 * 60 * 1000, // 상품 목록은 자주 안 바뀌니 5분 캐시
  });
}

export function useProductSearch(query) {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => searchFurnitureProducts(query),
    enabled: query.trim().length > 0,
  });
}

export function useProductDetail(id) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => fetchProductById(id),
    enabled: Boolean(id),
  });
}