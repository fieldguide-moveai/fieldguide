import React from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MobileHeader } from '../components/MobileHeader';
import { Check, Lightbulb, Sparkles } from 'lucide-react';

export const VoiceReportComplete: React.FC = () => {
  const location = useLocation();
  const { openHubAlert } = useApp();

  const reportResult = location.state?.result || {
    pointsEarned: 100,
    tags: ['야간위험', '조명불량'],
    summary: '좌측 조명 불량 및 야간 회전반경 좁음 제보',
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col justify-between w-full max-w-md mx-auto shadow-lg">
      <div>
        <MobileHeader title="제보 완료" showBack={false} />

        <main className="p-6 flex flex-col items-center pt-10 text-center space-y-6">
          {/* Success Glowing Icon */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-28 h-28 bg-green-100 rounded-full opacity-60 blur-lg" />
            <div className="w-20 h-20 bg-[#2E7D32] rounded-full flex items-center justify-center relative z-10 shadow-md border-4 border-green-50">
              <Check className="w-10 h-10 text-white stroke-[3]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-gray-900">제보가 등록되었습니다!</h2>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              다음 운송인의 안전에<br />
              큰 도움이 됩니다.
            </p>
          </div>

          {/* Reward Points Card */}
          <div className="w-full bg-[#F8FAFF] border border-blue-100 rounded-2xl p-5 flex flex-col items-center shadow-xs space-y-2">
            <span className="text-xs font-bold text-gray-500">획득 포인트</span>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-7 h-7 text-[#F59E0B] fill-[#F59E0B]" />
              <span className="text-3xl font-extrabold text-[#1A2B5C]">
                +{reportResult.pointsEarned}P
              </span>
            </div>

            {reportResult.tags && (
              <div className="flex flex-wrap justify-center gap-1 pt-2">
                {reportResult.tags.map((tag: string, idx: number) => (
                  <span key={idx} className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400 font-medium">
            포인트는 주유/세차 쿠폰으로<br />
            교환할 수 있어요
          </p>
        </main>
      </div>

      <div className="p-4 pb-20 bg-white border-t border-gray-100 sticky bottom-0 z-30 shadow-md">
        <button
          onClick={() =>
            openHubAlert({
              type: 'operational',
              knowledgeId: 'kn_gimpo_op1',
              hubName: 'AA 냉동창고 (김포)',
              beforeText: '평균 대기시간 40분',
              afterText: '실시간 대기시간 18분으로 감소',
            })
          }
          className="w-full h-14 bg-[#1A2B5C] text-white text-base font-bold rounded-xl shadow-md hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center"
        >
          확인
        </button>
      </div>
    </div>
  );
};
