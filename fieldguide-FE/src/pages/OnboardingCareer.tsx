import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MobileHeader } from '../components/MobileHeader';
import { Plus, Minus } from 'lucide-react';

export const OnboardingCareer: React.FC = () => {
  const navigate = useNavigate();
  const { onboardingAnswers, setOnboardingAnswers } = useApp();
  const [years, setYears] = useState<number>(onboardingAnswers.careerYears || 5);

  const handleNext = () => {
    setOnboardingAnswers(prev => ({ ...prev, careerYears: years }));
    navigate('/onboarding/region');
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col justify-between w-full max-w-md mx-auto shadow-lg">
      <div>
        <MobileHeader
          title="Onboarding"
          step={1}
          totalSteps={5}
          showSkip
          onSkip={() => navigate('/home')}
        />

        <main className="px-5 pt-6 pb-20">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#1A2B5C] leading-snug">
              나에게 맞는<br />
              운송 가이드 만들기
            </h2>
            <p className="text-sm font-medium text-gray-600 mt-2">
              운송 경력이 얼마나 되나요?
            </p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-[#1A2B5C] p-6 flex flex-col items-center justify-center shadow-[0px_4px_12px_rgba(26,43,92,0.08)] mb-6">
            <div className="flex items-center gap-3 w-full justify-center">
              <button
                type="button"
                onClick={() => setYears(Math.max(0, years - 1))}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95"
              >
                <Minus className="w-5 h-5" />
              </button>

              <div className="flex items-baseline gap-1 mx-2">
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Math.max(0, Math.min(50, parseInt(e.target.value) || 0)))}
                  className="w-20 text-center text-3xl font-bold text-[#1A2B5C] outline-none border-b-2 border-[#1A2B5C] py-1"
                  min={0}
                  max={50}
                />
                <span className="text-lg font-bold text-gray-600">년</span>
              </div>

              <button
                type="button"
                onClick={() => setYears(Math.min(50, years + 1))}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              경력에 맞춰 베테랑 기사들의 맞춤 팁을 추천해 드립니다.
            </p>
          </div>
        </main>
      </div>

      <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0">
        <button
          onClick={handleNext}
          className="w-full h-14 bg-[#1A2B5C] text-white text-base font-bold rounded-xl shadow-md hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center"
        >
          다음
        </button>
      </div>
    </div>
  );
};
