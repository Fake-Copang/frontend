import axios from 'axios';
import {
  DAILY_GRANT,
  readBalance,
  writeBalance,
  readLastCheckIn,
  writeLastCheckIn,
  todayKey,
} from './mockDb';

export { DAILY_GRANT };

// 백엔드에 지갑(User) API가 아직 없어서 mock 사용 중
const USE_MOCK = true;

const apiClient = axios.create({ baseURL: '/api' });

/* ---------------- 실제 API (TODO: 백엔드 명세가 정해지면 경로/응답 맞추기) ---------------- */

async function realFetchWallet() {
  const { data } = await apiClient.get('/wallet'); // 예상 응답: { balance, checkedInToday }
  return data;
}

async function realCheckIn() {
  const { data } = await apiClient.post('/wallet/check-in');
  return data;
}

async function realChargeWallet(amount) {
  const { data } = await apiClient.post('/wallet/charge', { amount });
  return data;
}

/* ---------------- 임시 mock (localStorage) ---------------- */

function mockError(message, status) {
  const err = new Error(message);
  err.response = { status };
  return err;
}

async function mockFetchWallet() {
  return {
    balance: readBalance(),
    checkedInToday: readLastCheckIn() === todayKey(),
  };
}

// 출석체크: 하루에 한 번만 DAILY_GRANT만큼 지급
async function mockCheckIn() {
  if (readLastCheckIn() === todayKey()) {
    throw mockError('오늘은 이미 출석체크를 했어요', 409);
  }
  writeBalance(readBalance() + DAILY_GRANT);
  writeLastCheckIn(todayKey());
  return mockFetchWallet();
}

// 무료 충전 (실제 결제 없음)
async function mockChargeWallet(amount) {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw mockError('충전 금액이 올바르지 않아요', 400);
  }
  writeBalance(readBalance() + amount);
  return mockFetchWallet();
}

export const fetchWallet = USE_MOCK ? mockFetchWallet : realFetchWallet;
export const checkIn = USE_MOCK ? mockCheckIn : realCheckIn;
export const chargeWallet = USE_MOCK ? mockChargeWallet : realChargeWallet;