import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getHubInfo, getHubKnowledge } from '../services/hubService';
import { HubInfo, HubKnowledge } from '../types';
import { MobileHeader } from '../components/MobileHeader';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorFallback } from '../components/ErrorFallback';
import { MapPin, Clock, AlertTriangle, Award, Navigation, ChevronRight, ShieldAlert } from 'lucide-react';

export const SiteInfo: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { currentOrder } = useApp();

  const targetHubId = currentOrder?.hubId || 'hub_gimpo_01';

  const [hub, setHub] = useState<HubInfo | null>(null);
  const [knowledgeList, setKnowledgeList] = useState<HubKnowledge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [hubData, knData] = await Promise.all([
        getHubInfo(targetHubId),
        getHubKnowledge(targetHubId),
      ]);
      setHub(hubData);
      setKnowledgeList(knData);
    } catch (err: any) {
      setError(err.message || '현장 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [targetHubId]);

  const operationTips = knowledgeList.filter(k => k.type === 'operation');
  const safetyWarnings = knowledgeList.filter(k => k.type === 'safety');

  return (
    <div className="min-h-screen bg-[#F5F6F8] pb-36 w-full max-w-md mx-auto shadow-lg">
      <MobileHeader title="현장 정보" showBack={true} />

      <main className="p-4 space-y-4">
        {loading && <LoadingSkeleton message="하역장 현장지식 및 안전 정보 조회 중..." />}

        {error && <ErrorFallback message={error} onRetry={loadData} />}

        {hub && !loading && (
          <>
            {/* Destination Title Context */}
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#1A2B5C]">{hub.name}</h2>
              <p className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {hub.location}
              </p>
            </div>

            {/* Arrival Countdown Card */}
            <div className="bg-[#D8E2FF]/40 rounded-2xl p-4 flex items-center justify-between border border-blue-100">
              <div>
                <span className="text-[11px] font-bold text-gray-600 block mb-0.5">
                  도착 예정 시간
                </span>
                <h3 className="text-base font-bold text-[#1A2B5C]">
                  오후 2:30 도착 예정
                </h3>
              </div>
              <div className="bg-[#1A2B5C] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xs">
                12분 남음
              </div>
            </div>

            {/* Veteran Tip Card (Green Accent) */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden relative">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#2E7D32]" />
              <div className="p-4 pl-5 space-y-2">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold rounded-full">
                  <Award className="w-3.5 h-3.5" />
                  베테랑 팁
                </div>
                <p className="text-xs text-gray-800 font-medium leading-relaxed">
                  {operationTips[0]?.content ||
                    '주간 방문을 권장합니다. 야간 방문 시 보조 조명을 준비하세요.'}
                </p>
              </div>
            </div>

            {/* Safety Warning Card (Red Accent) */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden relative">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#BA1A1A]" />
              <div className="p-4 pl-5 space-y-3">
                <div className="flex items-center gap-2 text-[#BA1A1A]">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="text-sm font-bold text-[#BA1A1A]">
                    안전 경고 — {safetyWarnings.length || 5}건의 보고
                  </h3>
                </div>

                <ul className="space-y-2.5 text-xs text-gray-800">
                  {safetyWarnings.length > 0 ? (
                    safetyWarnings.map((item, idx) => (
                      <li key={item.id} className="flex items-start gap-2">
                        <ShieldAlert className="w-4 h-4 text-[#BA1A1A] shrink-0 mt-0.5" />
                        <span>{item.content}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start gap-2">
                        <ShieldAlert className="w-4 h-4 text-[#BA1A1A] shrink-0 mt-0.5" />
                        <span>야간 좌측 조명 불량</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ShieldAlert className="w-4 h-4 text-[#BA1A1A] shrink-0 mt-0.5" />
                        <span>회전 반경 좁음</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ShieldAlert className="w-4 h-4 text-[#BA1A1A] shrink-0 mt-0.5" />
                        <span>5톤 이상 차량 후진 진입 필요</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ShieldAlert className="w-4 h-4 text-[#BA1A1A] shrink-0 mt-0.5" />
                        <span>겨울철 노면 결빙 위험</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Navigation Start Fixed Button */}
      <div className="fixed bottom-[56px] left-0 right-0 w-full max-w-md mx-auto bg-white p-3 border-t border-gray-200 z-30 shadow-lg">
        <button
          onClick={() => navigate(`/order/${currentOrder?.id || 'ord_101'}/navigation`)}
          className="w-full h-14 bg-[#1A2B5C] text-white font-bold rounded-xl text-sm active:scale-95 transition-all shadow-md hover:opacity-90 flex items-center justify-center gap-2"
        >
          <Navigation className="w-5 h-5 fill-white" />
          네비게이션 시작
        </button>
      </div>
    </div>
  );
};
