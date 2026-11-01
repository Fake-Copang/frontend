import { useState } from 'react';
import ProductList from './shop/ui/ProductList';
import Cart from './shop/ui/Cart';
import './App.css';

export default function App() {
  // TODO: react-router-dom 세팅되면 이 탭 전환 대신 라우트로 교체
  const [page, setPage] = useState('products');

  return (
    <div>
      <nav className="app-tabs">
        <button
          type="button"
          className={page === 'products' ? 'is-active' : ''}
          onClick={() => setPage('products')}
        >
          상품 목록
        </button>
        <button
          type="button"
          className={page === 'cart' ? 'is-active' : ''}
          onClick={() => setPage('cart')}
        >
          장바구니
        </button>
      </nav>
      {page === 'products' ? <ProductList /> : <Cart />}
    </div>
  );
}