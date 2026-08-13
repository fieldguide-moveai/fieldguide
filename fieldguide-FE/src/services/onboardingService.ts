// TODO: 실제 API 연동 시 USE_MOCK을 false로 변경하고 주석 해제

import { API_BASE_URL, mockDelay } from './config';
import { OnboardingAnswers, GuidebookResult } from '../types';
import { generateGuidebookResult } from '../mocks/mockOnboarding';

export async function submitOnboarding(answers: OnboardingAnswers): Promise<{ success: boolean; id: string }> {
  // ===== 실제 API 연동 시 아래 주석 해제 =====
  // const res = await fetch(`${API_BASE_URL}/onboarding/submit`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(answers),
  // });
  // if (!res.ok) throw new Error('온보딩 정보 제출 실패');
  // return await res.json();
  // ==========================================

  await mockDelay(400);
  return { success: true, id: 'onboarding_res_' + Date.now() };
}

export async function getGuidebookResult(driverId: string, answers?: OnboardingAnswers): Promise<GuidebookResult> {
  // ===== 실제 API 연동 시 아래 주석 해제 =====
  // const res = await fetch(`${API_BASE_URL}/drivers/${driverId}/guidebook`);
  // if (!res.ok) throw new Error('운송 가이드 결과 조회 실패');
  // return await res.json();
  // ==========================================

  await mockDelay(500);
  return generateGuidebookResult(answers);
}
