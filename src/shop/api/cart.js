import axios from 'axios';

// 백엔드가 준비되면 false로 바꾸면 실제 API(/api/v1/...)를 호출함
const USE_MOCK = true;

const apiClient = axios.create({ baseURL: '/api/v1' });

/* ---------------- 실제 API ---------------- */

async function realFetchCart() {
  const { data } = await apiClient.get('/cart');
  return data; // [{ id, productId, name, price, imageUrl, quantity }, ...]
}

async function realAddToCart(productId, quantity = 1) {
  const { data } = await apiClient.post('/cart', { productId, quantity });
  return data;
}

async function realUpdateCartItemQuantity(cartItemId, quantity) {
  const { data } = await apiClient.patch(`/cart/${cartItemId}`, { quantity });
  return data;
}

async function realRemoveCartItem(cartItemId) {
  await apiClient.delete(`/cart/${cartItemId}`);
}

async function realCheckout(cartItemIds) {
  const { data } = await apiClient.post('/orders', { cartItemIds });
  return data;
}

/* ---------------- 임시 mock (localStorage) ---------------- */

const CART_KEY = 'mock-cart';
const BALANCE_KEY = 'mock-balance';
const DEFAULT_BALANCE = 1_000_000;
const USD_TO_KRW = 1300; // DummyJSON 가격이 달러라서 원화처럼 보이게 환산

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) ?? [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function readBalance() {
  const saved = localStorage.getItem(BALANCE_KEY);
  return saved === null ? DEFAULT_BALANCE : Number(saved);
}

async function mockFetchCart() {
  return readCart();
}

async function mockAddToCart(productId, quantity = 1) {
  const items = readCart();
  const existing = items.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    const { data: product } = await axios.get(`https://dummyjson.com/products/${productId}`);
    items.push({
      id: Date.now(),
      productId,
      name: product.title,
      price: Math.round(product.price * USD_TO_KRW),
      imageUrl: product.thumbnail,
      quantity,
    });
  }

  writeCart(items);
  return items;
}

async function mockUpdateCartItemQuantity(cartItemId, quantity) {
  const items = readCart().map((item) =>
    item.id === cartItemId ? { ...item, quantity } : item
  );
  writeCart(items);
  return items;
}

async function mockRemoveCartItem(cartItemId) {
  writeCart(readCart().filter((item) => item.id !== cartItemId));
}

async function mockCheckout(cartItemIds) {
  const items = readCart();
  const targets = items.filter((item) => cartItemIds.includes(item.id));
  const totalPrice = targets.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const balance = readBalance();

  if (totalPrice > balance) {
    const err = new Error('잔액 부족');
    err.response = { status: 400 }; // useCheckout의 잔액 부족 분기와 같은 형태
    throw err;
  }

  localStorage.setItem(BALANCE_KEY, String(balance - totalPrice));
  writeCart(items.filter((item) => !cartItemIds.includes(item.id)));
  return { orderId: Date.now(), totalPrice };
}

/* ---------------- export ---------------- */

export const fetchCart = USE_MOCK ? mockFetchCart : realFetchCart;
export const addToCart = USE_MOCK ? mockAddToCart : realAddToCart;
export const updateCartItemQuantity = USE_MOCK
  ? mockUpdateCartItemQuantity
  : realUpdateCartItemQuantity;
export const removeCartItem = USE_MOCK ? mockRemoveCartItem : realRemoveCartItem;
export const checkout = USE_MOCK ? mockCheckout : realCheckout;