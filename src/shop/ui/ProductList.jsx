import { useMemo, useState } from 'react';
import { useFurnitureProducts, useProductSearch } from '../hooks/useProducts';
import { extractSubCategories } from '../api/products';
import { useAddToCart } from '../hooks/useCart';
import ProductCard from './ProductCard';
import './ProductList.css';

export default function ProductList() {
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState(null); // null이면 '전체'

  const { mutate: addToCart } = useAddToCart();
  const allProducts = useFurnitureProducts();
  const searchResults = useProductSearch(query);

  // 검색어가 있으면 검색 결과를, 없으면 전체 목록을 기준으로 사용
  const isSearching = query.trim().length > 0;
  const baseList = isSearching ? searchResults.data : allProducts.data;

  const subCategories = useMemo(
    () => extractSubCategories(allProducts.data ?? []),
    [allProducts.data]
  );

  const filteredProducts = useMemo(() => {
    if (!baseList) return [];
    if (!activeTag) return baseList;
    return baseList.filter((p) => p.tags?.includes(activeTag));
  }, [baseList, activeTag]);

  const isLoading = isSearching ? searchResults.isLoading : allProducts.isLoading;
  const isError = isSearching ? searchResults.isError : allProducts.isError;

  function handleSearchSubmit(e) {
    e.preventDefault();
    setQuery(searchInput);
    setActiveTag(null);
  }

  function handleAddToCart(product) {
    addToCart(product.id);
  }

  return (
    <div className="shop">
      <aside className="shop__sidebar">
        <div className="shop__brand">Fake Coupang</div>

        <div className="shop__sidebar-head">
          <h2>가구 · 인테리어</h2>
          <span className="shop__count">{filteredProducts.length}개</span>
        </div>

        <form className="shop__search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="상품 검색"
          />
          <button type="submit">검색</button>
        </form>

        {!isSearching && subCategories.length > 0 && (
          <nav className="shop__chips" aria-label="세부 카테고리 필터">
            <button
              type="button"
              className={activeTag === null ? 'is-active' : ''}
              onClick={() => setActiveTag(null)}
            >
              전체
            </button>
            {subCategories.map((tag) => (
              <button
                key={tag}
                type="button"
                className={activeTag === tag ? 'is-active' : ''}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </nav>
        )}

        <p className="shop__hint">상품을 골라 장바구니에 담아보세요. 결제하면 내 방에 배치할 수 있어요.</p>
      </aside>

      <main className="shop__main">
        {isLoading && <p className="shop__status">상품을 불러오는 중이에요...</p>}
        {isError && <p className="shop__status">상품을 불러오지 못했어요. 다시 시도해주세요.</p>}
        {!isLoading && !isError && filteredProducts.length === 0 && (
          <p className="shop__status">조건에 맞는 상품이 없어요.</p>
        )}

        <div className="shop__grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </main>
    </div>
  );
}