// 주문/배송/절약액 계산용 순수 함수 모음 (화면과 mock 양쪽에서 같이 사용)

// 개발·시연용: 값을 키우면 배송이 빨리 진행됨 (예: 120이면 1시간 → 30초). 실제 동작 값은 1.
export const DELIVERY_TIME_SCALE = 1;

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export const STATUS_LABEL = {
  ORDERED: '주문완료',
  SHIPPING: '배송중',
  DELIVERED: '배송완료',
};

// 도착 예정 시각(ms) = 주문 시각 + 배송 소요 시간
export function getArrivalAt(order) {
  const start = new Date(order.orderedAt).getTime();
  return start + (order.estimatedDeliveryHours * HOUR) / DELIVERY_TIME_SCALE;
}

// mock에서만 사용: 전체 배송 시간 중 앞 30%는 ORDERED, 그 뒤는 SHIPPING, 도착 시각 이후는 DELIVERED
// (백엔드 연동 후에는 서버가 내려주는 status를 그대로 사용)
export function getDeliveryStatus(order, now = Date.now()) {
  const start = new Date(order.orderedAt).getTime();
  const arrival = getArrivalAt(order);
  if (now >= arrival) return 'DELIVERED';
  const progress = (now - start) / (arrival - start);
  return progress < 0.3 ? 'ORDERED' : 'SHIPPING';
}

// 최근 7일 vs 그 이전 7일 동안 가상으로 주문한 금액 합계
export function computeWeeklySavings(orders, now = Date.now()) {
  let thisWeek = 0;
  let lastWeek = 0;

  for (const order of orders) {
    const age = now - new Date(order.orderedAt).getTime();
    if (age < 0) continue;
    if (age < 7 * DAY) thisWeek += order.totalPrice;
    else if (age < 14 * DAY) lastWeek += order.totalPrice;
  }

  return { thisWeek, lastWeek, diff: thisWeek - lastWeek };
}