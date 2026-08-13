import { API_BASE_URL } from './config';
import { VoiceReportResult } from '../types';

export async function submitVoiceReport(
  hubId: string,
  driverId: string,
  audioBlob: Blob
): Promise<VoiceReportResult> {

  const formData = new FormData();

  // BE의 @RequestPart("file")과 이름을 맞춰야 함
  formData.append(
    'file',
    audioBlob,
    'report_recording.webm'
  );
  console.log('🔥 submitVoiceReport 호출');
  console.log('🎵 blob size:', audioBlob.size);
  console.log('🌐 URL:', `${API_BASE_URL}/api/audio/transcribe`);

  const res = await fetch(
    `${API_BASE_URL}/api/audio/transcribe`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error('음성 파일 전송 및 STT 처리 실패');
  }

  const text = await res.text();

  console.log('🎤 STT 결과:', text);

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