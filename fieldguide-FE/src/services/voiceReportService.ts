import { API_BASE_URL } from './config';
import { VoiceReportResult } from '../types';

export async function submitVoiceReport(
  // hubId: string,
  // driverId: string,
  audioBlob: Blob
): Promise<VoiceReportResult> {

  const formData = new FormData();

  // 음성 파일을 multipart/form-data의 "file"로 추가
  formData.append(
    'file',
    audioBlob,
    'report_recording.webm'
  );

    // hubId는 항상 1
  const hubId = 1;

  // memberId는 1 ~ 20 중 랜덤
  const memberId = Math.floor(Math.random() * 20) + 1;

  // POST
  // 예:
  // http://localhost:8080/api/tacit-reports?hubId=1&memberId=2
  const res = await fetch(
    `${API_BASE_URL}/tacit-reports?hubId=${hubId}&memberId=${memberId}`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!res.ok) {
    const errorText = await res.text();

    console.error('BE 오류:', errorText);

    throw new Error('음성 제보 등록 실패');
  }

  const text = await res.text();

  console.log('🎤 BE 응답:', text);

  return {
    reportId: 'voice_rpt_' + Date.now(),
    tags: [],
    summary: text,
    pointsEarned: 100,
    timestamp: new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}