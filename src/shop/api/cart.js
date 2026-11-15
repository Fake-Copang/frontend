import axios from 'axios';
import {
  MOCK_USER_ID,
  readCart,
  writeCart,
  readBalance,
  writeBalance,
  readOrders,
  writeOrders,
} from './mockDb';

/*
 * 장바구니는 DB에 저장하지 않고 이 브라우저(localStorage)에만 저장한다. (팀 결정)
 * 서버와 통신하는 건 '결제(checkout)'뿐이다.
 *
 * USE_MOCK_CHECKOUT = true  : 결제도 브라우저 안에서만 처리 (잔액 차감 + 주문 생성을 흉내)
 * USE_MOCK_CHECKOUT = false : 백엔드 POST /api/orders로 주문 생성
 *   - 아직 백엔드에 지갑 API가 없어서 잔액 차감/부족 검사는 되지 않음 (TODO)
 */
const USE_MOCK_CHECKOUT = true;

const CURRENT_USER_ID = MOCK_USER_ID; // TODO: 로그인이 붙으면 실제 사용자 id로 교체
const apiClient = axios.create({ baseURL: '/api' });

/* ---------------- 장바구니 (항상 로컬) ---------------- */

export async function fetchCart() {
  return readCart(); // [{ id, productId, name, price, imageUrl, quantity }, ...]
}

// product: 상품 목록의 상품 객체 { id, name, price, imageUrl }
// 담는 시점의 이름/가격/이미지를 같이 저장해서, 장바구니를 그릴 때 따로 조회하지 않는다.
export async function addToCart(product, quantity = 1) {
  const items = readCart();
  const existing = items.find((item) => item.productId === product.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({
      id: product.id, // 장바구니엔 상품당 한 줄만 있으므로 상품 id가 곧 항목 id (Date.now()는 같은 순간에 담으면 겹침)
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity,
    });
  }

  writeCart(items);
  return items;
}

export async function updateCartItemQuantity(cartItemId, quantity) {
  const items = readCart().map((item) =>
    item.id === cartItemId ? { ...item, quantity } : item
  );
  writeCart(items);
  return items;
}

export async function removeCartItem(cartItemId) {
  writeCart(readCart().filter((item) => item.id !== cartItemId));
}

/* ---------------- 결제 ---------------- */

// 결제 후 장바구니에서 결제한 항목을 지움
function removeFromCart(cartItemIds) {
  writeCart(readCart().filter((item) => !cartItemIds.includes(item.id)));
}

// mock: 잔액 확인 → 잔액 차감 → 주문 생성(백엔드 OrderResponse와 같은 모양) → 장바구니에서 제거
async function mockCheckout(cartItemIds) {
  const targets = readCart().filter((item) => cartItemIds.includes(item.id));
  const totalPrice = targets.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const balance = readBalance();

  if (totalPrice > balance) {
    const err = new Error('잔액 부족');
    err.response = { status: 400 }; // useCheckout의 잔액 부족 분기와 같은 형태
    throw err;
  }

  const now = Date.now();
  const order = {
    id: now,
    userId: CURRENT_USER_ID,
    totalPrice,
    orderedAt: new Date(now).toISOString(),
    estimatedDeliveryHours: 3 + Math.floor(Math.random() * 4), // 3~6시간
    status: 'ORDERED',
    items: targets.map((item, index) => ({
      id: now + index,
      productId: item.productId,
      productName: item.name,
      orderCount: item.quantity,
      unitPrice: item.price,
    })),
  };

  writeBalance(balance - totalPrice);
  writeOrders([...readOrders(), order]);
  removeFromCart(cartItemIds);
  return order;
}

// 백엔드 주문 API: POST /api/orders  { userId, items: [{ productId, orderCount }] }
async function realCheckout(cartItemIds) {
  const targets = readCart().filter((item) => cartItemIds.includes(item.id));
  const { data } = await apiClient.post('/orders', {
    userId: CURRENT_USER_ID,
    items: targets.map((item) => ({ productId: item.productId, orderCount: item.quantity })),
  });
  removeFromCart(cartItemIds); // 서버 주문이 성공한 뒤에만 장바구니에서 지움
  return data;
}

export const checkout = USE_MOCK_CHECKOUT ? mockCheckout : realCheckout;