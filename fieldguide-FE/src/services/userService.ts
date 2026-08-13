// TODO: 실제 API 연동 시 USE_MOCK을 false로 변경하고 주석 해제

import { API_BASE_URL, mockDelay } from './config';
import { UserProfile, TodaySummary } from '../types';
import { MOCK_USER_PROFILE, MOCK_TODAY_SUMMARY } from '../mocks/mockUser';

export async function getUserProfile(): Promise<UserProfile> {
  // ===== 실제 API 연동 시 아래 주석 해제 =====
  // const res = await fetch(`${API_BASE_URL}/user/profile`);
  // if (!res.ok) throw new Error('유저 프로필 조회 실패');
  // return await res.json();
  // ==========================================

  await mockDelay(250);
  return MOCK_USER_PROFILE;
}

export async function getTodaySummary(): Promise<TodaySummary> {
  // ===== 실제 API 연동 시 아래 주석 해제 =====
  // const res = await fetch(`${API_BASE_URL}/user/today-summary`);
  // if (!res.ok) throw new Error('오늘 운행 요약 조회 실패');
  // return await res.json();
  // ==========================================

  await mockDelay(300);
  return MOCK_TODAY_SUMMARY;
}
