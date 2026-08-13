import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTodaySummary } from '../services/userService';
import { TodaySummary } from '../types';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Route,
  Award,
  Wallet,
  Lightbulb,
  ChevronRight,
  Gauge,
  Zap,
  Truck,
  Fuel,
} from 'lucide-react';

const ORDER_STOP_TEMPLATES = [
  { badge: '도착', city: '경기 김포시 양촌읍', name: 'AA 냉동창고 (김포)', waitMinutes: 52 },
  { badge: '도착', city: '서울 강서구 등촌동', name: '고객사 하역지', waitMinutes: 25 },
  { badge: '도착', city: '인천 서구 가좌동', name: 'CC 팩토리', waitMinutes: 18 },
  { badge: '도착', city: '경기 안양시 만안구', name: 'BB 마트 물류센터', waitMinutes: 51 },
  { badge: '도착', city: '경기 시흥시 정왕동', name: 'DD 유통센터', waitMinutes: 40 },
];

const WAYPOINT_STOP = { badge: '경유', city: '경기 파주시 월롱면', name: 'BB 물류센터 (파주)', waitMinutes: 35 };

const formatClock = (minutesFromMidnight: number) => {
  const h = Math.floor(minutesFromMidnight / 60) % 24;
  const m = Math.round(minutesFromMidnight % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

const formatHoursMinutes = (hours: number) => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}시간 ${m}분`;
};

const buildSchedule = (orderCount: number, totalDurationMinutes: number, startMinutes: number) => {
  const deliveryStops = Array.from({ length: orderCount }, (_, i) => ORDER_STOP_TEMPLATES[i % ORDER_STOP_TEMPLATES.length]);

  const middleStops = orderCount >= 2 ? [deliveryStops[0], WAYPOINT_STOP, ...deliveryStops.slice(1)] : deliveryStops;

  const rows = [
    { badge: '출발', city: '인천 서구 경서동', name: '인천 서구 경서동 123-45', waitMinutes: undefined as number | undefined },
    ...middleStops,
    { badge: '복귀', city: '경기 부천시 오정구', name: '복귀지', waitMinutes: undefined as number | undefined },
  ];

  const step = totalDurationMinutes / (rows.length - 1);

  return rows.map((row, idx) => ({
    ...row,
    time: formatClock(startMinutes + step * idx),
  }));
};

const badgeStyle = (badge: string) => {
  switch (badge) {
    case '출발':
    case '도착':
      return 'bg-[#2563EB] text-white';
    case '경유':
      return 'bg-violet-500 text-white';
    default:
      return 'bg-[#1A2B5C] text-white';
  }
};

const dotStyle = (badge: string) => {
  switch (badge) {
    case '경유':
      return 'bg-violet-500';
    case '복귀':
      return 'bg-gray-400';
    default:
      return 'bg-[#2563EB]';
  }
};

export const TodayRunDetail: React.FC = () => {
  const navigate = useNavigate();
  const [todaySummary, setTodaySummary] = useState<TodaySummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTodaySummary().then((data) => {
      setTodaySummary(data);
      setLoading(false);
    });
  }, []);

  if (loading || !todaySummary) {
    return (
      <div className="min-h-screen bg-[#F5F6F8] w-full max-w-md mx-auto">
        <LoadingSkeleton message="오늘의 운행 상세 정보를 불러오는 중..." />
      </div>
    );
  }

  const orderCount = todaySummary.completedOrdersCount;
  const income = todaySummary.todayIncome;
  const distanceKm = todaySummary.totalDistanceKm;
  const activeHours = todaySummary.activeHours;
  const totalDurationMinutes = activeHours * 60;

  const schedule = buildSchedule(orderCount, totalDurationMinutes, 8 * 60 + 20);

  // Income breakdown — last item absorbs rounding so the parts always sum to `income` exactly.
  const baseFare = Math.round(income * 0.56);
  const extraFare = Math.round(income * 0.22);
  const backhaulBonus = Math.round(income * 0.16);
  const otherIncome = income - baseFare - extraFare - backhaulBonus;

  // Cost breakdown — derived from distance so it scales with the day's actual mock data.
  const fuelCost = Math.round(distanceKm * 110);
  const tollCost = 4200;
  const otherCost = 1740;
  const totalCost = fuelCost + tollCost + otherCost;
  const estimatedNetPay = income - totalCost;

  return (
    <div className="min-h-screen bg-[#F5F6F8] pb-10 w-full max-w-md mx-auto shadow-lg">
      {/* Dark Header */}
      <header className="bg-[#0B1B3D] pt-8 pb-5 px-4">
        <div className="flex justify-between items-center text-white/80 text-xs mb-4 font-semibold tracking-tight">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 text-white/90">
            <span className="material-symbols-outlined text-[16px]">signal_cellular_alt</span>
            <span className="material-symbols-outlined text-[16px]">wifi</span>
            <span className="material-symbols-outlined text-[16px]">battery_full</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-1 text-white active:scale-95" aria-label="뒤로가기">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-lg font-bold">오늘의 운행 상세</h1>
          <button className="p-1 text-white active:scale-95" aria-label="날짜 선택" title="날짜 선택">
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Summary Card */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-gray-900">오늘의 한눈 요약</h2>
            <span className="text-sm font-bold text-[#006d37]">{orderCount}건 운행</span>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500">총 운행시간</p>
                <p className="text-sm font-bold text-gray-900">{formatHoursMinutes(activeHours)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center shrink-0">
                <Route className="w-4 h-4 text-cyan-600" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500">총 운행거리</p>
                <p className="text-sm font-bold text-gray-900">{distanceKm.toFixed(1)}km</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4 text-violet-600" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500">총 수익</p>
                <p className="text-sm font-bold text-gray-900">{income.toLocaleString()}원</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500">예상 실수령액</p>
                <p className="text-sm font-bold text-[#006d37]">{estimatedNetPay.toLocaleString()}원</p>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-[#EAF7EF] border border-[#CDEBD9] rounded-xl px-3.5 py-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-[#1F5C3B] font-medium">
              <Lightbulb className="w-4 h-4 text-[#2E7D32] shrink-0" />
              <span>예상 실수령액은 유류비, 톨비 등 비용을 제외한 금액이에요.</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#2E7D32] shrink-0" />
          </div>
        </section>

        {/* Schedule Timeline */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-4">운행 일정</h2>

          <div className="relative">
            <div className="absolute left-[5px] top-2 bottom-2 w-px bg-gray-200" />
            <div className="space-y-5">
              {schedule.map((stop, idx) => (
                <div key={idx} className="relative flex items-start gap-3 pl-5">
                  <span className={`absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full border-2 border-white shadow ${dotStyle(stop.badge)}`} />

                  <span className="text-xs font-bold text-gray-700 w-11 shrink-0 pt-0.5">{stop.time}</span>

                  <span className={`text-[11px] font-bold px-2 py-1 rounded-md shrink-0 ${badgeStyle(stop.badge)}`}>
                    {stop.badge}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{stop.city}</p>
                    <p className="text-xs text-gray-400 truncate">{stop.name}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    {stop.waitMinutes !== undefined && (
                      <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-1 rounded-md font-medium whitespace-nowrap">
                        대기 {stop.waitMinutes}분
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Income & Cost Breakdown */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-gray-900">수익 및 비용 내역</h2>
            <span className="text-xs text-[#2563EB] font-bold inline-flex items-center gap-0.5">
              자세히 보기
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-[#2E7D32]">수익</span>
                <span className="text-sm font-extrabold text-[#2E7D32]">{income.toLocaleString()}원</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-gray-600 font-medium">
                <div className="flex justify-between">
                  <span>기본 운임</span>
                  <span>{baseFare.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span>추가 운임</span>
                  <span>{extraFare.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span>복화 오더 보너스</span>
                  <span>{backhaulBonus.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span>기타 수익</span>
                  <span>{otherIncome.toLocaleString()}원</span>
                </div>
              </div>
            </div>

            <div className="bg-red-50/60 border border-red-100 rounded-xl p-3.5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-[#BA1A1A]">비용</span>
                <span className="text-sm font-extrabold text-[#BA1A1A]">-{totalCost.toLocaleString()}원</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-gray-600 font-medium">
                <div className="flex justify-between">
                  <span>유류비 (예상)</span>
                  <span>- {fuelCost.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span>톨비 (예상)</span>
                  <span>- {tollCost.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span>기타 비용</span>
                  <span>- {otherCost.toLocaleString()}원</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 bg-[#F5F6F8] rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-700">예상 실수령액</span>
            <span className="text-xl font-extrabold text-[#2E7D32]">{estimatedNetPay.toLocaleString()}원</span>
          </div>
        </section>

        {/* Driving Stats */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-4">운행 통계</h2>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                <Gauge className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-[10px] text-gray-500">평균 속도</p>
              <p className="text-sm font-bold text-gray-900">
                41.3<span className="text-[10px] font-medium text-gray-400"> km/h</span>
              </p>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#BA1A1A]" />
              </div>
              <p className="text-[10px] text-gray-500">최고 속도</p>
              <p className="text-sm font-bold text-gray-900">
                87<span className="text-[10px] font-medium text-gray-400"> km/h</span>
              </p>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
                <Truck className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-[10px] text-gray-500">공차 비율</p>
              <p className="text-sm font-bold text-gray-900">14.8%</p>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center">
                <Fuel className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-[10px] text-gray-500">연비 (예상)</p>
              <p className="text-sm font-bold text-gray-900">
                4.2<span className="text-[10px] font-medium text-gray-400"> km/L</span>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
