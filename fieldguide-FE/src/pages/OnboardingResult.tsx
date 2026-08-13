import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getGuidebookResult } from '../services/onboardingService';
import { GuidebookResult } from '../types';
import { MobileHeader } from '../components/MobileHeader';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorFallback } from '../components/ErrorFallback';
import { Sparkles, Building2, TrendingUp, Clock, CalendarCheck, ChevronRight } from 'lucide-react';

export const OnboardingResult: React.FC = () => {
  const navigate = useNavigate();
  const { userInfo, onboardingAnswers } = useApp();

  const [guidebook, setGuidebook] = useState<GuidebookResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResult = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGuidebookResult(userInfo.id, onboardingAnswers);
      setGuidebook(data);
    } catch (err: any) {
      setError(err.message || '운송 가이드북 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResult();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F6F8] pb-24 w-full max-w-md mx-auto shadow-lg">
      <MobileHeader
        title="나의 운송 가이드"
        showBack={true}
        onBack={() => navigate('/home')}
        showNotification={true}
      />

      <main className="p-4 space-y-4">
        {loading && <LoadingSkeleton message="맞춤형 베테랑 운송 가이드북 생성 중..." />}

        {error && <ErrorFallback message={error} onRetry={fetchResult} />}

        {guidebook && !loading && (
          <>
            {/* Header Tags */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-3">
              <h2 className="text-xl font-bold text-[#1A2B5C]">나의 운송 가이드</h2>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-[#1A2B5C] font-semibold text-xs rounded-lg">
                <span>{userInfo.truckType || '5톤 카고'}</span>
                <span className="text-blue-300">•</span>
                <span>{onboardingAnswers.loadingRegions?.[0] || '인천·부천'}</span>
                <span className="text-blue-300">•</span>
                <span>{onboardingAnswers.operationType || '주간'}</span>
              </div>
            </div>

            {/* TOP 5 Recommended Clients */}
            <section className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#1A2B5C]" />
                초기 추천 거래처 TOP 5
              </h3>

              <div className="space-y-3">
                {guidebook.topClients.map((client, index) => (
                  <div
                    key={client.id}
                    className={`p-3.5 rounded-xl border ${
                      index === 0
                        ? 'border-[#2E7D32] bg-green-50/20'
                        : 'border-gray-200 bg-white'
                    } space-y-2 relative`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#1A2B5C] text-white text-[10px] font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <h4 className="font-bold text-sm text-gray-900">{client.name}</h4>
                      </div>
                      <span className="px-2 py-0.5 bg-[#E8F5E9] text-[#2E7D32] text-[11px] font-bold rounded-md">
                        {client.fitScore}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <div>
                        예상 대기 <strong className="text-gray-900 font-bold">{client.estWaitTime}</strong>
                      </div>
                      <div className="text-gray-300">|</div>
                      <div>
                        진입 난이도 <strong className="text-gray-900 font-bold">{client.entryDifficulty}</strong>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed pt-1 border-t border-gray-100/80">
                      {client.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Estimated Earnings Simulation */}
            <section className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#1A2B5C]" />
                예상 수익 시뮬레이션
              </h3>

              <div className="border border-gray-200 rounded-xl p-4 flex justify-between text-center bg-[#F5F6F8]/50">
                <div className="flex-1 space-y-1 border-r border-gray-200 pr-2">
                  <div className="text-xs text-gray-500 font-medium">상위 20%</div>
                  <div className="text-sm font-bold text-[#2E7D32]">
                    {guidebook.earningsSimulation.top20Percent.toLocaleString()}원
                  </div>
                </div>
                <div className="flex-1 space-y-1 border-r border-gray-200 px-2">
                  <div className="text-xs text-gray-500 font-medium">평균</div>
                  <div className="text-sm font-bold text-[#1A2B5C]">
                    {guidebook.earningsSimulation.average.toLocaleString()}원
                  </div>
                </div>
                <div className="flex-1 space-y-1 pl-2">
                  <div className="text-xs text-gray-500 font-medium">하위 20%</div>
                  <div className="text-sm font-bold text-gray-500">
                    {guidebook.earningsSimulation.bottom20Percent.toLocaleString()}원
                  </div>
                </div>
              </div>
            </section>

            {/* Veteran Pattern */}
            <section className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#1A2B5C]" />
                베테랑 운행 패턴
              </h3>

              <div className="border border-gray-200 rounded-xl p-4 space-y-3 text-xs bg-white">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">오더를 가장 많이 수락하는 시간</span>
                  <span className="font-bold text-[#1A2B5C]">
                    {guidebook.veteranPattern.peakAcceptTime}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                  <span className="text-gray-600">평균 운행 시작 시간</span>
                  <span className="font-bold text-gray-900">
                    {guidebook.veteranPattern.avgStartTime}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                  <span className="text-gray-600">평균 운행 종료 시간</span>
                  <span className="font-bold text-gray-900">
                    {guidebook.veteranPattern.avgEndTime}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                  <span className="text-gray-600">하루 평균 수행 오더 수</span>
                  <span className="font-bold text-[#2E7D32]">
                    {guidebook.veteranPattern.avgDailyOrders}건
                  </span>
                </div>
              </div>

              {/* Bar Chart Area */}
              <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
                <h4 className="text-xs font-bold text-gray-800">시간대별 오더 수락 비중</h4>
                <div className="flex items-end justify-between h-28 gap-1.5 pt-4">
                  {guidebook.hourlyAcceptanceDistribution.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end gap-1.5">
                      <div
                        className={`w-full rounded-t-sm transition-all ${
                          item.percentage >= 75 ? 'bg-[#1A2B5C]' : 'bg-gray-300'
                        }`}
                        style={{ height: `${item.percentage}%` }}
                      />
                      <span className="text-[10px] text-gray-500 font-medium">{item.hour}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insight Box */}
              <div className="bg-[#F8FBF9] border border-[#E5F0E9] rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-1.5 text-[#1A2B5C]">
                  <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                  <span className="font-bold text-xs">AI 인사이트</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  {guidebook.aiInsight}
                </p>
              </div>
            </section>

            {/* Start Operating CTA */}
            <button
              onClick={() => navigate('/home')}
              className="w-full h-14 bg-[#1A2B5C] text-white font-bold text-sm rounded-xl shadow-md hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
            >
              이 가이드북으로 홈 대시보드 진입
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </main>
    </div>
  );
};
