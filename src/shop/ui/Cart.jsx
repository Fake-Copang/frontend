import { useEffect, useMemo, useState } from 'react';
import { useCart, useUpdateCartItemQuantity, useRemoveCartItem, useCheckout } from '../hooks/useCart';
import CartItemRow from './CartItemRow';
import './Cart.css';

export default function Cart() {
  const { data: cartItems, isLoading, isError } = useCart();
  const { mutate: changeQuantity } = useUpdateCartItemQuantity();
  const { mutate: removeItem } = useRemoveCartItem();
  const [selectedIds, setSelectedIds] = useState([]);
  const [showChargeModal, setShowChargeModal] = useState(false);

  // 장바구니가 로드되면 기본적으로 전체 선택 상태로 시작
  useEffect(() => {
    if (cartItems) setSelectedIds(cartItems.map((item) => item.id));
  }, [cartItems]);

  const { mutate: runCheckout, isPending: isCheckingOut } = useCheckout({
    onSuccess: () => {
      // TODO: react-router 연결되면 주문 완료 페이지로 이동
      alert('결제가 완료됐어요. 곧 배송 상태를 확인할 수 있어요.');
    },
    onInsufficientBalance: () => setShowChargeModal(true),
  });

  const selectedItems = useMemo(
    () => (cartItems ?? []).filter((item) => selectedIds.includes(item.id)),
    [cartItems, selectedIds]
  );

  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function toggleSelect(id) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }

  function selectAll() {
    setSelectedIds((cartItems ?? []).map((item) => item.id));
  }

  function handleCheckoutSelected() {
    if (selectedIds.length === 0) return;
    runCheckout(selectedIds);
  }

  function handleCheckoutAll() {
    const allIds = (cartItems ?? []).map((item) => item.id);
    if (allIds.length === 0) return;
    runCheckout(allIds);
  }

  return (
    <div className="cart-page">
      <header className="cart-page__header">
        <h1 className="cart-page__logo">FAKE COUPANG</h1>
        <div className="cart-page__actions">
          <button type="button" className="btn btn--outline" onClick={handleCheckoutSelected}>
            선택 결제 ({selectedIds.length})
          </button>
          <button type="button" className="btn btn--primary" onClick={handleCheckoutAll}>
            전체 결제
          </button>
        </div>
      </header>

      <div className="cart-page__toolbar">
        <label>
          <input
            type="checkbox"
            checked={cartItems?.length > 0 && selectedIds.length === cartItems.length}
            onChange={selectAll}
          />
          전체 선택
        </label>
        <span className="cart-page__total">선택한 상품 합계: {totalPrice.toLocaleString()}원</span>
      </div>

      {isLoading && <p className="cart-page__status">장바구니를 불러오는 중이에요...</p>}
      {isError && <p className="cart-page__status">장바구니를 불러오지 못했어요.</p>}
      {!isLoading && !isError && cartItems?.length === 0 && (
        <p className="cart-page__status">장바구니가 비어있어요.</p>
      )}

      <div className="cart-page__list">
        {cartItems?.map((item) => (
          <CartItemRow
            key={item.id}
            item={item}
            checked={selectedIds.includes(item.id)}
            onToggle={toggleSelect}
            onQuantityChange={(id, qty) => changeQuantity({ cartItemId: id, quantity: qty })}
            onRemove={removeItem}
          />
        ))}
      </div>

      {isCheckingOut && <p className="cart-page__status">결제 처리 중이에요...</p>}

      {showChargeModal && (
        <div className="cart-page__modal-backdrop" onClick={() => setShowChargeModal(false)}>
          <div className="cart-page__modal" onClick={(e) => e.stopPropagation()}>
            <p>가상 잔액이 부족해요.</p>
            <button type="button" className="btn btn--primary" onClick={() => setShowChargeModal(false)}>
              잔액 충전하러 가기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}