import { useMemo } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useCountdown } from '../hooks/useCountdown';
import { getArrivalAt, STATUS_LABEL } from '../lib/orderUtils';
import './Orders.css';

function formatDate(iso) {
  return new Date(iso).toLocaleString('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function OrderCard({ order }) {
  const { hours, minutes, isArrived } = useCountdown(getArrivalAt(order));
  const delivered = order.status === 'DELIVERED';

  let etaText;
  if (delivered) etaText = '배송이 완료됐어요';
  else if (isArrived) etaText = '곧 배송 완료 처리돼요';
  else if (hours === 0) etaText = `앞으로 ${minutes}분 남음`;
  else etaText = `앞으로 ${hours}시간 ${minutes}분 남음`;

  return (
    <article className="order-card">
      <header className="order-card__head">
        <div>
          <p className="order-card__date">{formatDate(order.orderedAt)} 주문</p>
          <p className="order-card__id">주문번호 {order.id}</p>
        </div>
        <span className={`order-status order-status--${order.status.toLowerCase()}`}>
          {STATUS_LABEL[order.status]}
        </span>
      </header>

      <ul className="order-card__items">
        {order.items.map((item) => (
          <li key={item.id}>
            <span>
              {item.productName} × {item.orderCount}
            </span>
            <span>{(item.unitPrice * item.orderCount).toLocaleString()}원</span>
          </li>
        ))}
      </ul>

      <footer className="order-card__foot">
        <p className={delivered ? 'order-card__eta' : 'order-card__eta order-card__eta--active'}>
          {etaText}
        </p>
        <p className="order-card__total">총 {order.totalPrice.toLocaleString()}원</p>
      </footer>
    </article>
  );
}

export default function Orders() {
  const { data: orders, isLoading, isError } = useOrders();

  // 최근 주문이 위로 오게 정렬
  const sorted = useMemo(
    () => [...(orders ?? [])].sort((a, b) => new Date(b.orderedAt) - new Date(a.orderedAt)),
    [orders]
  );

  return (
    <div className="orders">
      <h2 className="orders__title">주문 내역</h2>

      {isLoading && <p className="orders__status">주문 내역을 불러오는 중이에요...</p>}
      {isError && <p className="orders__status">주문 내역을 불러오지 못했어요.</p>}
      {!isLoading && !isError && sorted.length === 0 && (
        <p className="orders__status">아직 주문 내역이 없어요.</p>
      )}

      <div className="orders__list">
        {sorted.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}