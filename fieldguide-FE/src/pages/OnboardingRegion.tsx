import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MobileHeader } from '../components/MobileHeader';
import { MapPin, X, Check, RotateCcw } from 'lucide-react';

const SEOUL_DISTRICTS = [
  '강남구', '강동구', '강북구', '강서구', '관악구', '광진구',
  '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구',
  '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구',
  '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'
];

export const OnboardingRegion: React.FC = () => {
  const navigate = useNavigate();
  const { onboardingAnswers, setOnboardingAnswers } = useApp();

  const [loadingRegions, setLoadingRegions] = useState<string[]>(onboardingAnswers.loadingRegions || ['서울 강서구', '인천 서구']);
  const [unloadingRegions, setUnloadingRegions] = useState<string[]>(onboardingAnswers.unloadingRegions || ['경기 김포시', '부천시']);
  const [radiusKm, setRadiusKm] = useState<number>(onboardingAnswers.radiusKm || 35);

  const [activeModal, setActiveModal] = useState<'loading' | 'unloading' | null>(null);
  const [selectedInModal, setSelectedInModal] = useState<string[]>([]);

  const handleOpenModal = (type: 'loading' | 'unloading') => {
    setActiveModal(type);
    setSelectedInModal(type === 'loading' ? [...loadingRegions] : [...unloadingRegions]);
  };

  const handleToggleDistrict = (district: string) => {
    if (selectedInModal.includes(district)) {
      setSelectedInModal(selectedInModal.filter(d => d !== district));
    } else {
      setSelectedInModal([...selectedInModal, district]);
    }
  };

  const handleSelectAllSeoul = () => {
    if (selectedInModal.includes('서울 전체')) {
      setSelectedInModal([]);
    } else {
      setSelectedInModal(['서울 전체']);
    }
  };

  const handleSaveModal = () => {
    if (activeModal === 'loading') {
      setLoadingRegions(selectedInModal.length > 0 ? selectedInModal : ['서울 전체']);
    } else {
      setUnloadingRegions(selectedInModal.length > 0 ? selectedInModal : ['경기 전체']);
    }
    setActiveModal(null);
  };

  const handleNext = () => {
    setOnboardingAnswers(prev => ({
      ...prev,
      loadingRegions,
      unloadingRegions,
      radiusKm,
    }));
    navigate('/onboarding/type');
  };

  return (
    <div className="h-screen bg-[#F5F6F8] flex flex-col w-full max-w-md mx-auto shadow-lg relative overflow-hidden">
      <MobileHeader
        title="Onboarding"
        step={2}
        totalSteps={5}
        showSkip
        onSkip={() => navigate('/home')}
      />

      <main className="flex-1 overflow-y-auto px-5 pt-5 pb-6 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-[#1A2B5C] leading-snug">
              나에게 맞는<br />
              운송 가이드 만들기
            </h2>
            <p className="text-sm font-medium text-gray-600 mt-1">
              선호하는 상차 및 하차 지역을 선택해 주세요.
            </p>
          </div>

          {/* Loading Area Card */}
          <section className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-1.5 text-gray-900">
                <MapPin className="w-5 h-5 text-blue-600 fill-blue-50" />
                상차지
              </h3>
              <button
                onClick={() => handleOpenModal('loading')}
                className="px-3 py-1.5 text-xs font-bold text-blue-600 border border-blue-200 rounded-lg bg-white hover:bg-blue-50 transition-colors"
              >
                지역 설정하기
              </button>
            </div>

            <div className="p-4 text-xs">
              {loadingRegions.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {loadingRegions.map((reg, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-bold">
                      {reg}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-2">지역을 설정하고 최적의 오더를 추천받으세요!</p>
              )}
            </div>

            {/* Range Slider Subsection */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-700">현위치 주변 반경</span>
                <span className="text-base font-extrabold text-blue-600">{radiusKm}km</span>
              </div>
              <input
                type="range"
                min={5}
                max={60}
                step={5}
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>5km</span>
                <span>60km</span>
              </div>
            </div>
          </section>

          {/* Unloading Area Card */}
          <section className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-1.5 text-gray-900">
                <MapPin className="w-5 h-5 text-blue-600 fill-blue-50" />
                하차지
              </h3>
              <button
                onClick={() => handleOpenModal('unloading')}
                className="px-3 py-1.5 text-xs font-bold text-blue-600 border border-blue-200 rounded-lg bg-white hover:bg-blue-50 transition-colors"
              >
                지역 설정하기
              </button>
            </div>

            <div className="p-4 text-xs">
              {unloadingRegions.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {unloadingRegions.map((reg, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-bold">
                      {reg}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-2">지역을 설정하고 최적의 오더를 추천받으세요!</p>
              )}
            </div>
          </section>

          {/* Guide Footer */}
          <div className="border-t border-dashed border-gray-300 pt-4 pb-2 text-xs">
            <h4 className="font-bold text-gray-800 mb-2">이용 안내</h4>
            <ul className="text-gray-600 space-y-1.5 leading-relaxed">
              <li className="flex items-start gap-1">
                <span className="text-gray-400">•</span>
                선호 상하차지를 설정하지 않을 경우, <strong className="text-gray-800 mx-0.5">현위치 주변</strong>의 오더만 추천해 드립니다.
              </li>
              <li className="flex items-start gap-1">
                <span className="text-gray-400">•</span>
                <strong className="text-gray-800 mr-0.5">선호 상하차지를 설정</strong>하면 해당 지역의 오더를 함께 추천해 드립니다.
              </li>
              <li className="flex items-start gap-1">
                <span className="text-gray-400">•</span>
                선호 상하차지 주변에서 올라온 오더 추천은 주소를 <span className="text-blue-600 font-bold ml-0.5">파란색</span>으로 강조해 보여줍니다.
              </li>
            </ul>
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

      {/* Region Picker Drawer Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex flex-col justify-end">
          <div className="bg-white rounded-t-2xl max-w-[390px] w-full mx-auto max-h-[80vh] flex flex-col overflow-hidden animate-slideUp">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-bold text-base text-[#1A2B5C]">
                {activeModal === 'loading' ? '상차지 설정' : '하차지 설정'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 text-gray-500 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <button
                onClick={handleSelectAllSeoul}
                className={`w-full py-3 text-center text-xs font-bold rounded-lg border transition-all ${
                  selectedInModal.includes('서울 전체')
                    ? 'bg-[#1A2B5C] text-white border-[#1A2B5C]'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                서울 전체 선택
              </button>

              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {SEOUL_DISTRICTS.map((dist) => {
                  const isSelected = selectedInModal.includes(dist) || selectedInModal.includes('서울 전체');
                  return (
                    <button
                      key={dist}
                      onClick={() => handleToggleDistrict(dist)}
                      className={`p-3 rounded-lg border text-center font-medium transition-all ${
                        isSelected
                          ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {dist}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-white flex gap-2">
              <button
                onClick={() => setSelectedInModal([])}
                className="w-1/3 py-3 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                초기화
              </button>
              <button
                onClick={handleSaveModal}
                className="flex-1 py-3 bg-[#1A2B5C] text-white rounded-xl text-xs font-bold shadow-sm hover:opacity-90"
              >
                저장하기 ({selectedInModal.length}개)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
