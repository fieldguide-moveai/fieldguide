// TODO: 실제 API 연동 시 USE_MOCK을 false로 변경하고 아래 서비스 주석을 해제하세요.
export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://api.example.com';
export const USE_MOCK = true; // 실제 연동 시 false로 전환

export function mockDelay(ms = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
