// TODO: 실제 API 연동 시 USE_MOCK을 false로 변경하고 주석 해제

import { API_BASE_URL, mockDelay } from './config';
import { Order } from '../types';
import { MOCK_ORDERS, MOCK_RETURN_ORDERS } from '../mocks/mockOrders';

export async function getNearbyOrders(): Promise<Order[]> {
  // ===== 실제 API 연동 시 아래 주석 해제 =====
  // const res = await fetch(`${API_BASE_URL}/orders/nearby`);
  // if (!res.ok) throw new Error('주변 추천 오더 조회 실패');
  // return await res.json();
  // ==========================================

  await mockDelay(350);
  return MOCK_ORDERS.filter(o => o.isRecommended);
}

export async function getOrderDetail(orderId: string): Promise<Order> {
  // ===== 실제 API 연동 시 아래 주석 해제 =====
  // const res = await fetch(`${API_BASE_URL}/orders/${orderId}`);
  // if (!res.ok) throw new Error('오더 상세 정보 조회 실패');
  // return await res.json();
  // ==========================================

  await mockDelay(300);
  const found = MOCK_ORDERS.find(o => o.id === orderId) || MOCK_RETURN_ORDERS.find(o => o.id === orderId);
  if (!found) {
    throw new Error('요청하신 오더 정보를 찾을 수 없습니다.');
  }
  return found;
}

export async function acceptOrder(orderId: string, driverId: string): Promise<{ success: boolean; message: string }> {
  // ===== 실제 API 연동 시 아래 주석 해제 =====
  // const res = await fetch(`${API_BASE_URL}/orders/${orderId}/accept`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ driverId }),
  // });
  // if (!res.ok) throw new Error('오더 수락 처리 실패');
  // return await res.json();
  // ==========================================

  await mockDelay(400);
  return { success: true, message: `오더(${orderId})가 수락되었습니다. 하역장 안내를 시작합니다.` };
}

export async function rejectOrder(orderId: string, driverId: string): Promise<{ success: boolean; message: string }> {
  // ===== 실제 API 연동 시 아래 주석 해제 =====
  // const res = await fetch(`${API_BASE_URL}/orders/${orderId}/reject`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ driverId }),
  // });
  // if (!res.ok) throw new Error('오더 거절 처리 실패');
  // return await res.json();
  // ==========================================

  await mockDelay(300);
  return { success: true, message: '오더를 거절하였습니다.' };
}

export async function getReturnOrders(driverId?: string, currentOrderId?: string): Promise<Order[]> {
  // ===== 실제 API 연동 시 아래 주석 해제 =====
  // const res = await fetch(`${API_BASE_URL}/orders/return?driverId=${driverId || ''}&currentOrder=${currentOrderId || ''}`);
  // if (!res.ok) throw new Error('회차 오더 추천 조회 실패');
  // return await res.json();
  // ==========================================

  await mockDelay(450);
  return MOCK_RETURN_ORDERS;
}
