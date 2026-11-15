// 백엔드가 완성되기 전까지 쓰는 임시 저장소 (브라우저 localStorage). 백엔드 연동이 끝나면 지워도 됨.
const KEYS = {
  cart: 'mock-cart',
  balance: 'mock-balance',
  orders: 'mock-orders',
  lastCheckIn: 'mock-last-checkin',
};

export const DEFAULT_BALANCE = 100_000; // 설계서: 회원가입 시 가상 화폐 100,000원 지급
export const DAILY_GRANT = 100_000; // 출석체크 1회 지급액 (임시값, 정책이 정해지면 수정)
export const MOCK_USER_ID = 1;

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const readCart = () => read(KEYS.cart, []);
export const writeCart = (items) => write(KEYS.cart, items);

export const readBalance = () => read(KEYS.balance, DEFAULT_BALANCE);
export const writeBalance = (value) => write(KEYS.balance, value);

export const readOrders = () => read(KEYS.orders, []);
export const writeOrders = (orders) => write(KEYS.orders, orders);

export const readLastCheckIn = () => read(KEYS.lastCheckIn, null);
export const writeLastCheckIn = (dateKey) => write(KEYS.lastCheckIn, dateKey);

// 'YYYY-MM-DD' (내 컴퓨터 날짜 기준) — 출석체크를 하루 1회로 제한할 때 사용
export function todayKey(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}