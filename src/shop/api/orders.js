import axios from 'axios';
import { readOrders } from './mockDb';
import { getDeliveryStatus } from '../lib/orderUtils';

// 주문 생성은 cart.js의 결제(checkout)에서 처리. 여기는 주문 내역 조회만 담당.
const USE_MOCK = true;

const CURRENT_USER_ID = 1; // TODO: 로그인이 붙으면 실제 사용자 id로 교체
const apiClient = axios.create({ baseURL: '/api' });

// 백엔드: GET /api/orders?userId=1
async function realFetchOrders() {
  const { data } = await apiClient.get('/orders', { params: { userId: CURRENT_USER_ID } });
  return data;
}

// mock: 시간이 지나면 상태가 바뀌도록 조회할 때마다 계산해서 내려줌
async function mockFetchOrders() {
  return readOrders().map((order) => ({ ...order, status: getDeliveryStatus(order) }));
}

export const fetchOrders = USE_MOCK ? mockFetchOrders : realFetchOrders;