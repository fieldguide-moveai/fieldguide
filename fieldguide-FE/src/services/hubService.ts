// TODO: 실제 API 연동 시 USE_MOCK을 false로 변경하고 주석 해제

import { API_BASE_URL, mockDelay } from './config';
import { HubInfo, HubKnowledge, HubValidationResponse } from '../types';
import { MOCK_HUBS } from '../mocks/mockHubs';

export async function getHubInfo(hubId: string): Promise<HubInfo> {
  // ===== 실제 API 연동 시 아래 주석 해제 =====
  // const res = await fetch(`${API_BASE_URL}/hubs/${hubId}`);
  // if (!res.ok) throw new Error('허브 정보 조회 실패');
  // return await res.json();
  // ==========================================

  await mockDelay(300);
  const hub = MOCK_HUBS.find(h => h.id === hubId) || MOCK_HUBS[0];
  return hub;
}

export async function getHubKnowledge(
  hubId: string,
  type?: 'operation' | 'safety'
): Promise<HubKnowledge[]> {
  // ===== 실제 API 연동 시 아래 주석 해제 =====
  // const res = await fetch(`${API_BASE_URL}/hubs/${hubId}/knowledge?type=${type || ''}`);
  // if (!res.ok) throw new Error('현장 지식 정보 조회 실패');
  // return await res.json();
  // ==========================================

  await mockDelay(300);
  const hub = MOCK_HUBS.find(h => h.id === hubId) || MOCK_HUBS[0];
  if (type) {
    return hub.knowledgeList.filter(k => k.type === type);
  }
  return hub.knowledgeList;
}

export async function submitValidation(
  knowledgeId: string,
  response: string
): Promise<{ success: boolean; updatedValidationCount: number }> {
  // ===== 실제 API 연동 시 아래 주석 해제 =====
  // const res = await fetch(`${API_BASE_URL}/knowledge/${knowledgeId}/validate`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ response, timestamp: new Date().toISOString() }),
  // });
  // if (!res.ok) throw new Error('현장 검증 정보 제출 실패');
  // return await res.json();
  // ==========================================

  await mockDelay(300);
  return {
    success: true,
    updatedValidationCount: Math.floor(Math.random() * 5) + 15,
  };
}
