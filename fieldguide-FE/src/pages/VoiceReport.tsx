import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { submitVoiceReport } from '../services/voiceReportService';
import { MobileHeader } from '../components/MobileHeader';
import { Mic, Square, Loader2, Info } from 'lucide-react';

export const VoiceReport: React.FC = () => {
  const navigate = useNavigate();
  const { userInfo, currentOrder, addPoints } = useApp();

  const [isRecording, setIsRecording] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Start Browser MediaRecorder API
  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setSeconds(prev => {
          if (prev >= 120) {
            setIsRecording(false);
            return 120;
          }
          return prev + 1;
        });
      }, 1000);
    }

    // Try requesting microphone permissions for real browser recording
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(stream => {
          const recorder = new MediaRecorder(stream);
          mediaRecorderRef.current = recorder;
          audioChunksRef.current = [];

          recorder.ondataavailable = event => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };

          recorder.onstop = () => {
            const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            setRecordedBlob(blob);
          };

          recorder.start();
        })
        .catch(err => {
          console.warn('Microphone access handled gracefully or denied:', err);
        });
    }

    return () => {
      if (timer) clearInterval(timer);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    } else {
      setIsRecording(true);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
        audioChunksRef.current = [];
        mediaRecorderRef.current.start();
      }
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const hubId = currentOrder?.hubId || 'hub_gimpo_01';
    const blobToUpload = recordedBlob || new Blob(['mock audio'], { type: 'audio/webm' });

    try {
      const result = await submitVoiceReport(hubId, userInfo.id, blobToUpload);
      addPoints(result.pointsEarned);
      navigate('/report/complete', { state: { result } });
    } catch (err: any) {
      alert('제보 등록 실패: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col justify-between w-full max-w-md mx-auto shadow-lg">
      <div>
        <MobileHeader title="현장 경험 남기기" showBack={true} />

        <main className="p-5 flex flex-col items-center pt-8 pb-24 text-center">
          <h2 className="text-base text-gray-800 font-medium mb-12 leading-relaxed">
            다음 운송인에게도 도움이 될 현장 정보나<br />
            주의사항을 음성으로 알려주세요.
          </h2>

          {/* Microphone Ripple Animation Container */}
          <div className="flex flex-col items-center justify-center mb-10">
            <button
              onClick={handleToggleRecord}
              className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
                isRecording
                  ? 'bg-green-100 animate-recording-ripple border-4 border-green-200'
                  : 'bg-gray-100 border-4 border-gray-300 hover:bg-gray-200'
              }`}
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
                {isRecording ? (
                  <Mic className="w-10 h-10 text-[#2E7D32]" />
                ) : (
                  <Square className="w-8 h-8 text-gray-700 fill-gray-700" />
                )}
              </div>
            </button>

            <p className={`text-sm font-bold mt-6 ${isRecording ? 'text-[#2E7D32] animate-pulse' : 'text-gray-500'}`}>
              {isRecording ? '녹음 중...' : '녹음 일시정지'}
            </p>

            <div className="w-20 h-0.5 bg-gray-200 my-4" />

            {/* Timer */}
            <div className="flex items-baseline gap-1 text-gray-900 font-mono">
              <span className="text-2xl font-extrabold">{formatTimer(seconds)}</span>
              <span className="text-xs font-semibold text-gray-400">/ 02:00</span>
            </div>
          </div>

          {/* Guidelines */}
          <div className="w-full text-left bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-600 space-y-1.5">
            <p className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
              최대 2분까지 녹음할 수 있어요.
            </p>
            <p className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
              개인 정보는 AI에 의해 자동으로 비식별 처리돼요.
            </p>
          </div>
        </main>
      </div>

      <div className="p-4 pb-20 bg-white border-t border-gray-100 sticky bottom-0 z-30 shadow-md">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full h-14 bg-[#1A2B5C] text-white text-base font-bold rounded-xl shadow-md hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              AI 음성 태깅 및 제보 등록 중...
            </>
          ) : (
            '제보 완료'
          )}
        </button>
      </div>
    </div>
  );
};
