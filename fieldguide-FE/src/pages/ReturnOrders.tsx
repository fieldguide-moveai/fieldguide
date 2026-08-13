import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getReturnOrders, acceptOrder } from '../services/orderService';
import { Order } from '../types';
import { MobileHeader } from '../components/MobileHeader';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorFallback } from '../components/ErrorFallback';
import { Sparkles, Route, Timer, CheckCircle2, AlertTriangle, ShieldAlert, Info } from 'lucide-react';

export const ReturnOrders: React.FC = () => {
  const navigate = useNavigate();
  const { userInfo, addWaypoint } = useApp();

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReturnOrders(userInfo.id);
      setOrders(data);
      if (data.length > 0) {
        setSelectedOrderId(data[0].id);
      }
    } catch (err: any) {
      setError(err.message || '복화 추천 오더를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAccept = async (order: Order) => {
    setSubmittingId(order.id);
    try {
      await acceptOrder(order.id, userInfo.id);
      addWaypoint(order);
      navigate(-1);
    } catch (err: any) {
      alert('오더 수락 실패: ' + err.message);
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] pb-24 w-full max-w-md mx-auto shadow-lg">
      <MobileHeader title="복화 추천 오더" showBack={true} showNotification={true} />

      <main className="p-4 space-y-4">
        {loading && <LoadingSkeleton message="베테랑 현장 지식 기반 회차 오더 탐색 중..." />}

        {error && <ErrorFallback message={error} onRetry={fetchOrders} />}

        {!loading && (
          <>
            {/* Header Title Section */}
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-lg font-bold text-gray-900">복화 추천 오더</h2>
                <p className="text-xs text-gray-500 font-medium">
                  {orders.length}개의 회차 오더를 찾았습니다
                </p>
              </div>

              <div className="flex items-center gap-1 bg-[#F5F6F8] px-2.5 py-1 rounded-full border border-gray-200 text-xs font-bold text-[#1A2B5C]">
                <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>AI 어시스턴트</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1 -mt-1">
              <Info className="w-3.5 h-3.5" />
              베테랑 기사님들의 실시간 현장 지식 데이터를 기반으로 합니다
            </p>

            {/* Orders List */}
            <div className="space-y-4 pt-1">
              {orders.map((order, idx) => {
                const isTopPick = idx === 0 || order.isRecommended;
                const isExpanded = selectedOrderId === order.id;

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`bg-white rounded-2xl p-4 transition-all cursor-pointer shadow-xs ${
                      isTopPick
                        ? 'border-2 border-[#2E7D32] shadow-[0px_4px_12px_rgba(46,125,50,0.08)]'
                        : 'border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-base text-gray-900">
                          {order.clientName}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">
                          {order.origin} → {order.destination}
                        </p>
                      </div>
                      <span className="text-lg font-extrabold text-[#1A2B5C]">
                        ₩{order.freightFee.toLocaleString()}
                      </span>
                    </div>

                    {/* Route Match & Wait Time Grid */}
                    <div className="grid grid-cols-2 gap-2 bg-[#F5F6F8] p-3 rounded-xl text-xs mb-3">
                      <div className="flex items-center gap-2">
                        <Route className="w-4 h-4 text-gray-400" />
                        <div>
                          <span className="text-[10px] text-gray-400 block leading-tight">경로 일치</span>
                          <span className="font-bold text-gray-800">{order.matchRatePercent}%</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-gray-400" />
                        <div>
                          <span className="text-[10px] text-gray-400 block leading-tight">평균 대기</span>
                          <span className={`font-bold ${order.avgWaitTimeMinutes > 50 ? 'text-[#BA1A1A]' : 'text-[#2E7D32]'}`}>
                            {order.avgWaitTimeMinutes} min
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Safety Badge */}
                    <div className="mb-3">
                      {order.riskCount === 0 ? (
                        <div className="inline-flex items-center gap-1.5 bg-[#E8F5E9] text-[#2E7D32] px-3 py-1.5 rounded-lg text-xs font-bold w-full">
                          <CheckCircle2 className="w-4 h-4" />
                          위험 보고 없음
                        </div>
                      ) : order.riskCount <= 2 ? (
                        <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-lg text-xs font-bold w-full">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          위험 보고: {order.riskCount}건
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 bg-red-50 text-[#BA1A1A] px-3 py-1.5 rounded-lg text-xs font-bold w-full">
                          <ShieldAlert className="w-4 h-4" />
                          위험 보고: {order.riskCount}건
                        </div>
                      )}
                    </div>

                    {/* AI Recommendation Quote Comment */}
                    {order.aiRecommendationReason && isExpanded && (
                      <div className="bg-[#F8FBF9] p-3 rounded-xl border border-gray-200 text-xs text-gray-700 italic leading-relaxed mb-3">
                        "{order.aiRecommendationReason}"
                      </div>
                    )}

                    {/* Accept CTA Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAccept(order);
                      }}
                      disabled={submittingId === order.id}
                      className={`w-full h-12 rounded-xl text-xs font-bold text-white shadow-xs active:scale-95 transition-all flex items-center justify-center ${
                        isTopPick
                          ? 'bg-[#1A2B5C] hover:opacity-90'
                          : 'bg-gray-800 hover:bg-gray-900'
                      }`}
                    >
                      {submittingId === order.id ? '수락 처리 중...' : '오더 수락하기'}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
};
