import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { submitValidation } from '../services/hubService';
import { AlertTriangle, CheckCircle2, Info, ArrowRight, X } from 'lucide-react';

export const HubAlertModal: React.FC = () => {
  const { hubAlertModal, closeHubAlert, addPoints } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  if (!hubAlertModal.isOpen) return null;

  const handleVote = async (responseType: string) => {
    setSubmitting(true);
    try {
      await submitValidation(hubAlertModal.knowledgeId, responseType);
      addPoints(10); // Reward 10P for validating knowledge
      setSubmittedMessage('소중한 의견 감사드립니다! (+10P 적립 완료)');
      setTimeout(() => {
        setSubmittedMessage(null);
        setSubmitting(false);
        closeHubAlert();
      }, 1200);
    } catch (err) {
      setSubmittedMessage('의견 제출 중 오류가 발생했습니다.');
      setSubmitting(false);
    }
  };

  const isOperational = hubAlertModal.type === 'operational';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-[350px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col relative">
        {/* Close Button */}
        <button
          onClick={closeHubAlert}
          className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-700 rounded-full bg-gray-100/80 active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-5 space-y-4">
          {/* Header Badge */}
          <div className="flex items-center gap-2">
            {isOperational ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#1A2B5C] text-xs font-bold rounded-full border border-blue-200">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                현장 정보 확인 알림
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-[#BA1A1A] text-xs font-bold rounded-full border border-red-200">
                <AlertTriangle className="w-3.5 h-3.5 text-[#BA1A1A]" />
                현장 안전 검증
              </span>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#1A2B5C]">
              {hubAlertModal.hubName}
            </h3>
            <p className="text-xs text-gray-600">
              {isOperational
                ? '최근 기사 제보에 따른 현장 변경 사항입니다. 맞나요?'
                : '이전에 제보된 안전 경고 사항이 아직 위험한가요?'}
            </p>
          </div>

          {/* Body Content Box */}
          {isOperational ? (
            <div className="bg-[#F5F6F8] rounded-xl p-3.5 border border-gray-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-500 font-medium flex-1 text-center">
                  <span className="block text-[10px] text-gray-400">이전 정보</span>
                  {hubAlertModal.beforeText || '대기 40분 이상'}
                </div>
                <ArrowRight className="w-4 h-4 text-blue-600 mx-2 shrink-0" />
                <div className="bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-200 text-[#1A2B5C] font-bold flex-1 text-center">
                  <span className="block text-[10px] text-blue-500">최신 제보</span>
                  {hubAlertModal.afterText || '대기 18분 (빠름)'}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50/70 border border-red-200 rounded-xl p-3.5 text-xs text-gray-800 space-y-1">
              <p className="font-bold text-[#BA1A1A] flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                제보된 안전 경고 내용:
              </p>
              <blockquote className="italic text-gray-700 bg-white p-2.5 rounded-lg border border-red-100 font-medium">
                "{hubAlertModal.quoteText || '야간 좌측 조명 불량 및 B동 진입로 회전반경 좁음'}"
              </blockquote>
            </div>
          )}

          {submittedMessage ? (
            <div className="bg-green-50 border border-green-200 text-[#2E7D32] p-3 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {submittedMessage}
            </div>
          ) : isOperational ? (
            /* Operational 2 Buttons */
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                disabled={submitting}
                onClick={() => handleVote('agree')}
                className="py-3 bg-[#1A2B5C] text-white text-xs font-bold rounded-xl active:scale-95 transition-all shadow-sm hover:opacity-90 disabled:opacity-50"
              >
                맞아요
              </button>
              <button
                disabled={submitting}
                onClick={() => handleVote('disagree')}
                className="py-3 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-xl active:scale-95 transition-all hover:bg-gray-50 disabled:opacity-50"
              >
                달라졌어요
              </button>
            </div>
          ) : (
            /* Safety 3 Stacked Buttons */
            <div className="flex flex-col gap-2 pt-1">
              <button
                disabled={submitting}
                onClick={() => handleVote('still_dangerous')}
                className="py-2.5 bg-[#BA1A1A] text-white text-xs font-bold rounded-xl active:scale-95 transition-all shadow-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1"
              >
                진짜 위험해요 (경고 유지)
              </button>
              <button
                disabled={submitting}
                onClick={() => handleVote('improved')}
                className="py-2.5 bg-[#2E7D32] text-white text-xs font-bold rounded-xl active:scale-95 transition-all shadow-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1"
              >
                개선되었어요 (해제 요청)
              </button>
              <button
                disabled={submitting}
                onClick={() => handleVote('other')}
                className="py-2 bg-gray-100 text-gray-600 text-xs font-medium rounded-xl active:scale-95 transition-all hover:bg-gray-200 disabled:opacity-50"
              >
                기사 추가제보 / 내용 수정
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
