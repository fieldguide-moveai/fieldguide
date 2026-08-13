// TODO: 실제 API 연동 시 USE_MOCK을 false로 변경하고 주석 해제

import { API_BASE_URL, mockDelay } from './config';
import { VoiceReportResult } from '../types';

/**
 * [음성 제보 및 AI 자동 태깅 파이프라인 안내]
 * 본 함수는 브라우저 MediaRecorder API로 녹음된 오디오 바이너리(audioBlob)를
 * 서버 multipart/form-data로 전달하며, 백엔드에서 음성-텍스트 변환(STT) 및
 * 멀티모달 LLM/AI(Claude, Gemini 등)를 연동하여 현장 위험 태그 자동 추출,
 * 텍스트 요약 생성, 안전 기여 포인트(+100P) 지급을 일괄 처리합니다.
 */
export async function submitVoiceReport(
  hubId: string,
  driverId: string,
  audioBlob: Blob
): Promise<VoiceReportResult> {
  // ===== 실제 API 연동 시 아래 주석 해제 =====
  // const formData = new FormData();
  // formData.append('audio', audioBlob, 'report_recording.webm');
  // formData.append('hubId', hubId);
  // formData.append('driverId', driverId);
  //
  // const res = await fetch(`${API_BASE_URL}/reports/voice`, {
  //   method: 'POST',
  //   body: formData, // Multipart File Upload Header
  // });
  // if (!res.ok) throw new Error('음성 제보 및 AI 처리 실패');
  // return await res.json(); // { reportId: '...', tags: [...], summary: '...', pointsEarned: 100 }
  // ==========================================

  await mockDelay(1500); // AI 음성 분석 및 STT + 요약 파이프라인 처리 시간 시뮬레이션

  return {
    reportId: 'voice_rpt_' + Date.now(),
    tags: ['야간위험', '조명불량', '진입주의', '회전반경'],
    summary: 'B동 하역장 좌측 조명 꺼짐 및 야간 후진 진입 시 진입로 회전반경 좁아 충돌 위험 발생',
    pointsEarned: 100,
    timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
  };
}
