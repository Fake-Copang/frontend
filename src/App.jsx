import { useState } from 'react';
import ProductList from './shop/ui/ProductList';
import Cart from './shop/ui/Cart';
import Orders from './shop/ui/Orders';
import MyWallet from './shop/ui/MyWallet';
import { useWallet } from './shop/hooks/useWallet';
import './App.css';

const TABS = [
  { key: 'products', label: '상품 목록' },
  { key: 'cart', label: '장바구니' },
  { key: 'orders', label: '주문 내역' },
  { key: 'wallet', label: '내 지갑' },
];

export default function App() {
  // TODO: react-router-dom 세팅되면 이 탭 전환 대신 라우트로 교체
  const [page, setPage] = useState('products');
  const { data: wallet } = useWallet();

  return (
    <div>
      <nav className="app-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={page === tab.key ? 'is-active' : ''}
            onClick={() => setPage(tab.key)}
          >
            {tab.label}
          </button>
        ))}
        {wallet && <span className="app-tabs__balance">잔액 {wallet.balance.toLocaleString()}원</span>}
      </nav>

      {page === 'products' && <ProductList />}
      {page === 'cart' && (
        <Cart onOrderComplete={() => setPage('orders')} onGoWallet={() => setPage('wallet')} />
      )}
      {page === 'orders' && <Orders />}
      {page === 'wallet' && <MyWallet />}
    </div>
  );
}