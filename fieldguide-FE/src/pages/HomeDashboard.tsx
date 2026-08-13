import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getTodaySummary } from '../services/userService';
import { getNearbyOrders } from '../services/orderService';
import { TodaySummary, Order } from '../types';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorFallback } from '../components/ErrorFallback';
import { ChevronRight, MapPin, Bell } from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { userInfo, openHubAlert } = useApp();

  const [todaySummary, setTodaySummary] = useState<TodaySummary | null>(null);
  const [nearbyOrders, setNearbyOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryData, ordersData] = await Promise.all([
        getTodaySummary(),
        getNearbyOrders(),
      ]);
      setTodaySummary(summaryData);
      setNearbyOrders(ordersData);
    } catch (err: any) {
      setError(err.message || '홈 대시보드 데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Default orders matching exact image mockup if data loads or is empty
  const displayOrders = nearbyOrders.length > 0 ? nearbyOrders : [
    {
      id: 'ord_101',
      clientName: 'AA 냉동창고',
      origin: '인천',
      destination: '부천',
      freightFee: 58000,
      cargoType: '냉동',
      weightTons: 2.5,
      distanceKm: 28,
      riskCount: 0,
      avgWaitTimeMinutes: 32,
      matchRatePercent: 95,
      netFare: 47400,
      badge: '추천',
      badgeType: 'success',
      estDriveHours: 2,
      estDriveMinutes: 54,
    },
    {
      id: 'ord_102',
      clientName: 'BB 물류센터',
      origin: '시흥',
      destination: '안산',
      freightFee: 51000,
      cargoType: '일반',
      weightTons: 3.5,
      distanceKm: 18,
      riskCount: 2,
      avgWaitTimeMinutes: 58,
      matchRatePercent: 88,
      netFare: 40200,
      badge: '대기시간 주의',
      badgeType: 'warning',
      estDriveHours: 3,
      estDriveMinutes: 10,
    },
  ];

  return (
    <div className="bg-[#f7f9fc] min-h-screen pb-28 w-full max-w-md mx-auto shadow-2xl relative font-sans text-gray-900 select-none">
      {/* Top Banner Header */}
      <header className="bg-[#102a56] pt-8 pb-20 px-5 rounded-b-3xl relative shadow-md">
        {/* Status Bar */}
        <div className="flex justify-between items-center text-white/80 text-xs mb-4 font-semibold tracking-tight">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 text-white/90">
            <span className="material-symbols-outlined text-[16px]">signal_cellular_alt</span>
            <span className="material-symbols-outlined text-[16px]">wifi</span>
            <span className="material-symbols-outlined text-[16px]">battery_full</span>
          </div>
        </div>

        {/* Greeting & Notification */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-white text-lg font-normal leading-tight">
              안녕하세요,<br />
              <span className="font-bold text-2xl tracking-tight">
                {userInfo.name || '김트러커'} 기사님!
              </span>
            </h1>
          </div>

          <button
            onClick={() =>
              openHubAlert({
                type: 'operational',
                knowledgeId: 'kn_gimpo_op1',
                hubName: 'AA 냉동창고 (김포)',
                beforeText: '평균 대기시간 40분',
                afterText: '실시간 대기 18분으로 감소',
              })
            }
            className="relative p-2 text-white hover:bg-white/10 rounded-full transition-colors active:scale-95"
            title="알림 및 현장 정보"
          >
            <span className="material-symbols-outlined text-[26px]">notifications</span>
            <span className="absolute top-1 right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] font-bold text-white items-center justify-center border-2 border-[#102a56]">
                1
              </span>
            </span>
          </button>
        </div>
      </header>

      {/* Main Content Area overlapping top banner */}
      <main className="px-5 -mt-12 space-y-5 relative z-10">
        {loading && <LoadingSkeleton message="오늘의 운행 요약 불러오는 중..." />}
        {error && <ErrorFallback message={error} onRetry={loadData} />}

        {!loading && (
          <>
            {/* Summary Card */}
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-base font-bold text-gray-800 mb-1">오늘의 운행 요약</h2>
                  <p className="text-[#006d37] font-bold text-sm mb-3">
                    {todaySummary?.completedOrdersCount || 2}건 운행 예정
                  </p>
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-0.5">오늘의 수익</p>
                    <p className="text-2xl font-bold text-gray-900 tracking-tight">
                      ₩{(todaySummary?.todayIncome || 128400).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/onboarding/result')}
                    className="text-xs text-blue-600 font-semibold inline-flex items-center gap-0.5 hover:underline"
                  >
                    <span>자세히 보기</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>

                {/* Truck image illustration */}
                <div className="w-28 h-28 shrink-0 relative">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxVNud4sk7yAwaa3fj0pT9AhfRVaXOLbtUn0WvpftnFqfC5WAJxhCv6wTGICJ9rGiHNmEig1a2dlFJLwOWzWMMlozQ5qcvPxXjyqDkNwAlShjvSJU4_lpqDWBkZiQ5f2oloXbhvm1I-_RXO7tclREW_BqLsk8GxoF-KERjaOSO6IgwThmmKzC1U2R-l9GIsxaYtadFzOSn7g4tTeJ0A5eaTwgTyvoOVRfqah58hVVIswazrtgsGVThEQ"
                    alt="Logistics Truck"
                    className="w-full h-full object-contain object-bottom"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/src/assets/images/truck_highway_thumb_1786446157361.jpg';
                    }}
                  />
                </div>
              </div>
            </section>

            {/* Recommended Orders Section */}
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 text-base">지금 주변 추천 오더</h3>
                <button
                  onClick={() => navigate('/orders')}
                  className="text-xs text-gray-500 hover:text-[#102a56] font-medium transition-colors"
                >
                  전체보기
                </button>
              </div>

              <div className="space-y-3">
                {displayOrders.map((order: any) => {
                  const netFare = order.netFare || Math.round(order.freightFee * 0.82);
                  const isWarning = order.badgeType === 'warning' || (order.riskCount && order.riskCount > 0);
                  const badgeText = order.badge || (isWarning ? '대기시간 주의' : '추천');
                  const routeTitle = `${order.origin} → ${order.destination}`;

                  return (
                    <div
                      key={order.id}
                      onClick={() => navigate(`/order/${order.id}`)}
                      className="p-4 rounded-xl border border-gray-100 bg-white hover:border-blue-200 shadow-sm cursor-pointer transition-all active:scale-[0.99]"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-base font-bold text-gray-900">{routeTitle}</h4>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            isWarning
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {badgeText}
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 mb-2">
                        운임 {order.freightFee.toLocaleString()}원
                      </p>

                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-2xl font-bold text-[#102a56]">
                          {netFare.toLocaleString()}원
                        </span>
                        <span className="text-[10px] text-gray-500">예상 실수령액</span>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex gap-4 text-xs text-gray-500">
                        <span>
                          예상 소요{' '}
                          <strong className="text-gray-800">
                            {order.estDriveHours || 2}시간 {order.estDriveMinutes || 54}분
                          </strong>
                        </span>
                        <span>
                          평균 대기{' '}
                          <strong className="text-gray-800">
                            {order.avgWaitTimeMinutes || order.avgWaitMin || 32}분
                          </strong>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Personalized Guidebook Promo Banner */}
            <section
              onClick={() => navigate('/onboarding/result')}
              className="bg-[#102a56] rounded-2xl p-5 relative overflow-hidden flex items-center justify-between shadow-sm cursor-pointer hover:bg-[#16366b] transition-colors"
            >
              <div className="z-10">
                <p className="text-white text-xs mb-1 opacity-90">
                  {userInfo.name || '김트러커'}님을 위한
                </p>
                <h3 className="text-white text-xl font-bold mb-1">맞춤 가이드북</h3>
                <p className="text-blue-200 text-xs">허브 데이터 + 내 운행 패턴 분석</p>
              </div>

              <div className="w-20 h-20 relative shrink-0">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRi9Uxoic8EpQSgSJKr8dY1pnlIgvwK5XGvN1XR3IiE46stGqq37Hk-crRUeh8BPuNtJEyV-MYhNEcc-GHMGWQx_I--YMlrjTGxH6eBS1CYGXUoIJy20ovoqobkzBuwf_2iGYOpQob-O1FITdoFBCwFiwgsB-UGEXw7zqAvam9EQ_1U6ZRoY7vwuobK0dUJOWZLpKDQvDtKq9IY6ArD5r_3vGrmb83x4eEdp4RlJy1MOG4TDh5hytpKA"
                  alt="Personalized Guidebook Icon"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/src/assets/images/navy_book_icon_1786446170420.jpg';
                  }}
                />
              </div>
            </section>

            {/* Quick Action Navigation Simulator Button */}
            <button
              onClick={() => navigate('/order/ord_101/site-info')}
              className="w-full bg-white border border-gray-200 hover:bg-gray-50 py-3.5 px-4 rounded-xl font-bold text-sm text-[#001539] shadow-sm flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
            >
              <span className="material-symbols-outlined text-blue-600">location_on</span>
              현재 운행지 현장 정보 보기 (AA 냉동창고)
            </button>
          </>
        )}
      </main>
    </div>
  );
};
