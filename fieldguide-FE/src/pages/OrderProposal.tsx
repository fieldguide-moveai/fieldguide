import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getOrderDetail, acceptOrder, rejectOrder } from '../services/orderService';
import { estimateCost } from '../services/costService';
import { Order, CostBreakdown } from '../types';
import { MobileHeader } from '../components/MobileHeader';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorFallback } from '../components/ErrorFallback';
import { Star, CheckCircle2, AlertCircle } from 'lucide-react';

export const OrderProposal: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { userInfo, setCurrentOrder } = useApp();

  const targetId = orderId || 'ord_101';

  const [order, setOrder] = useState<Order | null>(null);
  const [cost, setCost] = useState<CostBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadOrderData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [orderData, costData] = await Promise.all([
        getOrderDetail(targetId),
        estimateCost(targetId, '인천 서구 경서동'),
      ]);
      setOrder(orderData);
      setCost(costData);
    } catch (err: any) {
      setError(err.message || '오더 제안 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [targetId]);

  const handleAccept = async () => {
    if (!order) return;
    setSubmitting(true);
    try {
      await acceptOrder(order.id, userInfo.id);
      setCurrentOrder(order);
      navigate(`/order/${order.id}/site-info`);
    } catch (err: any) {
      alert('오더 수락 실패: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!order) return;
    setSubmitting(true);
    try {
      await rejectOrder(order.id, userInfo.id);
      navigate('/return-orders');
    } catch (err: any) {
      navigate('/home');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] pb-36 w-full max-w-md mx-auto shadow-lg">
      <MobileHeader title="오더 제안" showBack={true} />

      <main className="p-4 space-y-4">
        {loading && <LoadingSkeleton message="오더 실수령액 및 동선 분석 중..." />}

        {error && <ErrorFallback message={error} onRetry={loadOrderData} />}

        {order && cost && !loading && (
          <>
            {/* Order Title & Fee Header */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-2">
              <div className="flex gap-1.5">
                <span className="bg-[#FFF5D6] text-[#B68D00] px-2 py-0.5 rounded text-[11px] font-bold">
                  추천
                </span>
                <span className="bg-[#E6EFFF] text-[#2F4673] px-2 py-0.5 rounded text-[11px] font-bold">
                  {order.cargoType}
                </span>
              </div>

              <div className="flex justify-between items-end pt-1">
                <h2 className="text-xl font-bold text-gray-900">{order.clientName}</h2>
                <span className="text-xs text-gray-500 font-medium">{order.distanceKm}km</span>
              </div>

              <div className="flex items-baseline gap-1 pt-1">
                <span className="text-3xl font-extrabold text-[#1A2B5C]">
                  {order.freightFee.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-gray-700">원 운임</span>
              </div>
            </div>

            {/* Estimated Net Pay Cost Breakdown Card */}
            <section className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs space-y-3">
              <div className="flex justify-between items-center pb-2.5 border-b border-gray-100">
                <span className="text-sm font-bold text-[#1A2B5C]">예상 실수령액</span>
                <span className="text-lg font-bold text-[#2E7D32]">
                  {cost.estimatedNetPay.toLocaleString()}원
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">운임</span>
                  <span className="font-bold text-gray-900">{cost.freightFee.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">공차 이동 연료비</span>
                  <span className="font-bold text-[#1A2B5C]">-{cost.emptyDistanceFuelCost.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">운행 연료비</span>
                  <span className="font-bold text-[#1A2B5C]">-{cost.transitFuelCost.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">톨비 추정</span>
                  <span className="font-bold text-[#1A2B5C]">-{cost.estimatedTollCost.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">수수료(10.8%)</span>
                  <span className="font-bold text-[#1A2B5C]">-{cost.platformFee.toLocaleString()}원</span>
                </div>
              </div>

              <div className="bg-gray-50 p-2.5 rounded-xl text-[11px] text-gray-400">
                * 기사님의 실시간 GPS 위치({cost.calculatedAtLocation}) 기준 동적 계산값입니다.
              </div>
            </section>

            {/* Estimated Duration Card */}
            <section className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-gray-900">예상 소요 시간</h3>
              <div className="text-xl font-extrabold text-[#1A2B5C]">2시간 54분</div>

              {/* 3 Color Segmented Progress Bar */}
              <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
                <div className="bg-[#1A2B5C] w-[45%]" title="운행 1시간 20분"></div>
                <div className="bg-[#F59E0B] w-[30%]" title="체류 52분"></div>
                <div className="bg-gray-300 w-[25%]" title="공차 이동 42분"></div>
              </div>

              <div className="flex justify-between text-xs text-gray-700">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#1A2B5C]"></span>
                  <span className="text-gray-500">운행</span>
                  <strong className="font-bold">1시간 20분</strong>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                  <span className="text-gray-500">체류</span>
                  <strong className="font-bold">52분</strong>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                  <span className="text-gray-500">공차 이동</span>
                  <strong className="font-bold">42분</strong>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 pt-2 border-t border-gray-100 leading-tight">
                * {order.clientName} 오후 시간대(14~18시) 실측 평균<br />
                (최근 30일, 47건 방문 기반)
              </p>
            </section>
          </>
        )}
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-[56px] left-0 right-0 w-full max-w-md mx-auto bg-white p-3 border-t border-gray-200 z-30 shadow-lg">
        <div className="flex gap-2">
          <button
            onClick={handleReject}
            disabled={submitting}
            className="flex-1 h-14 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl text-sm active:scale-95 transition-all hover:bg-gray-50 disabled:opacity-50"
          >
            거절
          </button>
          <button
            onClick={handleAccept}
            disabled={submitting}
            className="flex-[2] h-14 bg-[#1A2B5C] text-white font-bold rounded-xl text-sm active:scale-95 transition-all shadow-md hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? '처리 중...' : '수락하기'}
          </button>
        </div>
      </div>
    </div>
  );
};
