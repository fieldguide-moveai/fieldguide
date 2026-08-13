import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MobileHeader } from '../components/MobileHeader';
import { Truck, Package, Check } from 'lucide-react';

export const OnboardingType: React.FC = () => {
  const navigate = useNavigate();
  const { onboardingAnswers, setOnboardingAnswers } = useApp();
  const [selectedType, setSelectedType] = useState<'독차' | '혼적'>(onboardingAnswers.operationType || '독차');

  const handleNext = () => {
    setOnboardingAnswers(prev => ({ ...prev, operationType: selectedType }));
    navigate('/onboarding/time');
  };

  return (
    <div className="h-screen bg-[#F5F6F8] flex flex-col w-full max-w-md mx-auto shadow-lg overflow-hidden">
      <MobileHeader
        title="Onboarding"
        step={3}
        totalSteps={5}
        showSkip
        onSkip={() => navigate('/home')}
      />

      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#1A2B5C] leading-snug">
              나에게 맞는<br />
              운송 가이드 만들기
            </h2>
            <p className="text-sm font-medium text-gray-700 mt-2">
              주로 어떤 형태로 운행하시나요?
            </p>
          </div>

          {/* 2 Card Selection */}
          <div className="grid grid-cols-2 gap-3">
            {/* Option 1: 독차 */}
            <button
              type="button"
              onClick={() => setSelectedType('독차')}
              className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 h-44 transition-all active:scale-95 ${
                selectedType === '독차'
                  ? 'border-[#1A2B5C] bg-white shadow-[0px_4px_12px_rgba(26,43,92,0.12)]'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <Truck
                className={`w-12 h-12 mb-3 ${
                  selectedType === '독차' ? 'text-[#1A2B5C]' : 'text-gray-400'
                }`}
              />
              <span
                className={`text-base font-bold ${
                  selectedType === '독차' ? 'text-[#1A2B5C]' : 'text-gray-600'
                }`}
              >
                독차
              </span>
              {selectedType === '독차' && (
                <div className="absolute top-2.5 right-2.5 w-6 h-6 bg-[#1A2B5C] text-white rounded-full flex items-center justify-center shadow-xs">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </button>

            {/* Option 2: 혼적 */}
            <button
              type="button"
              onClick={() => setSelectedType('혼적')}
              className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 h-44 transition-all active:scale-95 ${
                selectedType === '혼적'
                  ? 'border-[#1A2B5C] bg-white shadow-[0px_4px_12px_rgba(26,43,92,0.12)]'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <Package
                className={`w-12 h-12 mb-3 ${
                  selectedType === '혼적' ? 'text-[#1A2B5C]' : 'text-gray-400'
                }`}
              />
              <span
                className={`text-base font-bold ${
                  selectedType === '혼적' ? 'text-[#1A2B5C]' : 'text-gray-600'
                }`}
              >
                혼적
              </span>
              {selectedType === '혼적' && (
                <div className="absolute top-2.5 right-2.5 w-6 h-6 bg-[#1A2B5C] text-white rounded-full flex items-center justify-center shadow-xs">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </button>
          </div>
      </main>

      <div className="p-4 bg-white border-t border-gray-100 shrink-0">
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
