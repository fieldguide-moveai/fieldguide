import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MobileHeader } from '../components/MobileHeader';
import { submitOnboarding } from '../services/onboardingService';
import { Clock, Loader2 } from 'lucide-react';

const TIME_OPTIONS = [
  '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00',
  '12:00', '14:00', '16:00', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '21:00', '22:00'
];

export const OnboardingTime: React.FC = () => {
  const navigate = useNavigate();
  const { onboardingAnswers, setOnboardingAnswers } = useApp();

  const [startTime, setStartTime] = useState<string>(onboardingAnswers.preferredStartTime || '06:00');
  const [endTime, setEndTime] = useState<string>(onboardingAnswers.preferredEndTime || '18:00');
  const [submitting, setSubmitting] = useState(false);

  const handleComplete = async () => {
    const updatedAnswers = {
      ...onboardingAnswers,
      preferredStartTime: startTime,
      preferredEndTime: endTime,
    };
    setOnboardingAnswers(updatedAnswers);

    setSubmitting(true);
    try {
      await submitOnboarding(updatedAnswers);
      navigate('/onboarding/result');
    } catch (err) {
      navigate('/onboarding/result');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col justify-between w-full max-w-md mx-auto shadow-lg">
      <div>
        <MobileHeader
          title="Onboarding"
          step={4}
          totalSteps={5}
          showSkip
          onSkip={() => navigate('/home')}
        />

        <main className="px-5 pt-6 pb-20">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#1A2B5C] leading-snug">
              나에게 맞는<br />
              운송 가이드 만들기
            </h2>
            <p className="text-sm font-medium text-gray-700 mt-2">
              선호하는 운행 시간대는 언제인가요?
            </p>
          </div>

          <div className="bg-[#F5F6F8] rounded-2xl p-5 border border-gray-200 space-y-5">
            {/* Display Selected Time */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
              <div>
                <span className="text-xs text-gray-400 font-bold block mb-0.5">선택된 시간</span>
                <span className="text-lg font-bold text-[#1A2B5C]">
                  {startTime} ~ {endTime}
                </span>
              </div>
              <Clock className="w-6 h-6 text-[#1A2B5C]" />
            </div>

            {/* Time Pickers */}
            <div className="grid grid-cols-2 gap-3">
              {/* Start Time Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600">시작 시간</label>
                <div className="h-44 overflow-y-auto bg-white rounded-xl border border-gray-200 py-1 no-scrollbar">
                  {TIME_OPTIONS.map((time) => (
                    <button
                      key={`start-${time}`}
                      type="button"
                      onClick={() => setStartTime(time)}
                      className={`w-full py-2 text-xs font-bold transition-all ${
                        startTime === time
                          ? 'bg-blue-50 text-[#1A2B5C] border-y border-blue-200'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* End Time Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600">종료 시간</label>
                <div className="h-44 overflow-y-auto bg-white rounded-xl border border-gray-200 py-1 no-scrollbar">
                  {TIME_OPTIONS.map((time) => (
                    <button
                      key={`end-${time}`}
                      type="button"
                      onClick={() => setEndTime(time)}
                      className={`w-full py-2 text-xs font-bold transition-all ${
                        endTime === time
                          ? 'bg-blue-50 text-[#1A2B5C] border-y border-blue-200'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400">
              30분 단위로 선택 가능합니다
            </p>
          </div>
        </main>
      </div>

      <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0">
        <button
          onClick={handleComplete}
          disabled={submitting}
          className="w-full h-14 bg-[#1A2B5C] text-white text-base font-bold rounded-xl shadow-md hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              가이드북 생성 중...
            </>
          ) : (
            '완료 및 가이드북 생성'
          )}
        </button>
      </div>
    </div>
  );
};
