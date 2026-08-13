export const API_BASE_URL = 'http://localhost:8080/api';

export const USE_MOCK = false;

export function mockDelay(ms = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}