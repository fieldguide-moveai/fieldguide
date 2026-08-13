// TODO: 실제 API 연동 시 USE_MOCK을 false로 변경하고 주석 해제

import { API_BASE_URL, mockDelay } from './config';
import { CostBreakdown } from '../types';
import { MOCK_ORDERS } from '../mocks/mockOrders';

/**
 * [중요 서비스 설계 유의사항]
 * 이 함수(estimateCost)는 DB에 저장된 고정 데이터를 불러오는 것이 아니라,
 * 호출 시점의 기사 실시간 GPS 위치(currentLocation: 위경도 또는 행정구역) 및
 * 최신 유가, 예상 톨게이트 비용, 기사 차량 연비를 결합하여
 * 실시간(Dynamic Calculation)으로 동적 재계산하는 핵심 도메인 로직 서비스입니다.
 */
export async function estimateCost(orderId: string, currentLocation: string = '인천 서구 경서동'): Promise<CostBreakdown> {
  // ===== 실제 API 연동 시 아래 주석 해제 =====
  // const res = await fetch(`${API_BASE_URL}/costs/estimate`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ orderId, currentLocation }),
  // });
  // if (!res.ok) throw new Error('실시간 운송 비용 및 실수령액 동적 계산 실패');
  // return await res.json();
  // ==========================================

  await mockDelay(350); // 실시간 경로 및 실시간 연료비 계산 서버 연산 지연 시뮬레이션

  const order = MOCK_ORDERS.find(o => o.id === orderId) || MOCK_ORDERS[0];
  const fee = order.freightFee;

  // 실시간 기사 위치에 따른 공차 거리 및 유가 연산 시뮬레이션
  const emptyFuel = Math.round(fee * 0.055);
  const transitFuel = Math.round(fee * 0.10);
  const toll = 1600;
  const platformFee = Math.round(fee * 0.108); // 10.8%
  const netPay = fee - emptyFuel - transitFuel - toll - platformFee;

  return {
    orderId,
    freightFee: fee,
    emptyDistanceFuelCost: emptyFuel,
    transitFuelCost: transitFuel,
    estimatedTollCost: toll,
    platformFee: platformFee,
    estimatedNetPay: netPay,
    calculatedAtLocation: currentLocation,
  };
}
