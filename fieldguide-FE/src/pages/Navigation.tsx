import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getReturnOrders } from '../services/orderService';
import { Order } from '../types';
import {
  Navigation as NavIcon,
  Volume2,
  VolumeX,
  Compass,
  X,
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  MapPin,
  Flag,
} from 'lucide-react';

type StopKind = 'done' | 'active' | 'new' | 'upcoming' | 'final';

const formatKoreanTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours < 12 ? '오전' : '오후';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${period} ${displayHour}:${minutes.toString().padStart(2, '0')}`;
};

export const Navigation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { currentOrder, waypoints, lastAddedWaypointId, clearLastAddedWaypoint } = useApp();

  const [returnOrders, setReturnOrders] = useState<Order[]>([]);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    getReturnOrders(undefined, orderId).then((orders) => {
      setReturnOrders(orders);
    });
  }, [orderId]);

  useEffect(() => {
    if (!lastAddedWaypointId) return;
    const timer = setTimeout(() => clearLastAddedWaypoint(), 5000);
    return () => clearTimeout(timer);
  }, [lastAddedWaypointId, clearLastAddedWaypoint]);

  const topReturnOrder = returnOrders[0];
  const newlyAddedWaypoint = waypoints.find((w) => w.id === lastAddedWaypointId) || null;

  const routeStops = [
    { key: 'origin', label: '출발지', kind: 'done' as const },
    { key: 'base', label: currentOrder?.clientName || '1차 목적지', kind: 'active' as const },
    ...waypoints.map((w) => ({
      key: w.id,
      label: w.clientName,
      kind: (w.id === lastAddedWaypointId ? 'new' : 'upcoming') as StopKind,
    })),
    { key: 'final', label: '최종 목적지', kind: 'final' as const },
  ];

  const baseMinutes = 15;
  const extraMinutes = waypoints.reduce((sum, w) => sum + Math.round(w.distanceKm * 1.8) + 10, 0);
  const totalMinutes = baseMinutes + extraMinutes;
  const durationLabel =
    totalMinutes >= 60 ? `${Math.floor(totalMinutes / 60)}시간 ${totalMinutes % 60}분` : `${totalMinutes}분`;
  const totalDistanceKm = 6.2 + waypoints.reduce((sum, w) => sum + w.distanceKm, 0);
  const arrivalLabel = formatKoreanTime(new Date(Date.now() + totalMinutes * 60000));

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-[#0F172A] text-white flex flex-col justify-between overflow-hidden shadow-2xl">
      {/* Map Graphic Mockup Background */}
      <div className="absolute inset-0 bg-[#0F172A] overflow-hidden pointer-events-none">
        {/* Simulated Map SVG with realistic road grid & labels */}
        <svg className="w-full h-full opacity-60" viewBox="0 0 390 844" fill="none">
          {/* Grid Road Network */}
          <path d="M -50 200 H 450" stroke="#1E293B" strokeWidth="16" />
          <path d="M -50 450 H 450" stroke="#1E293B" strokeWidth="20" />
          <path d="M -50 680 H 450" stroke="#1E293B" strokeWidth="12" />
          <path d="M 100 -50 V 900" stroke="#1E293B" strokeWidth="14" />
          <path d="M 300 -50 V 900" stroke="#1E293B" strokeWidth="14" />

          {/* Active Navigation Route Line */}
          <path
            d="M 195 844 C 195 650, 195 500, 195 380 C 195 300, 280 250, 320 180"
            stroke="#2563EB"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 195 844 C 195 650, 195 500, 195 380 C 195 300, 280 250, 320 180"
            stroke="#60A5FA"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="8 8"
            className="animate-pulse"
          />

          {/* Location Markers */}
          <circle cx="320" cy="180" r="8" fill="#EF4444" stroke="#FFFFFF" strokeWidth="3" />
          <circle cx="320" cy="180" r="16" fill="#EF4444" fillOpacity="0.2" className="animate-ping" />

          {/* Newly Added Waypoint Segment (Backhaul Order Accepted) */}
          {newlyAddedWaypoint && (
            <>
              <path
                d="M 320 180 C 300 140, 290 110, 300 90"
                stroke="#A855F7"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="4 10"
              />
              <circle cx="300" cy="90" r="16" fill="#A855F7" fillOpacity="0.25" className="animate-ping" />
              <circle cx="300" cy="90" r="8" fill="#A855F7" stroke="#FFFFFF" strokeWidth="3" />
            </>
          )}

          {/* Current Vehicle Position Pointer */}
          <g transform="translate(195, 520)">
            <circle cx="0" cy="0" r="22" fill="#2563EB" fillOpacity="0.25" className="animate-ping" />
            <circle cx="0" cy="0" r="14" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2.5" />
            <polygon points="0,-8 -6,6 0,2 6,6" fill="#FFFFFF" />
          </g>
        </svg>

        {/* Map District Name Labels */}
        <div className="absolute top-36 left-8 text-[11px] font-bold text-gray-400 bg-slate-900/60 px-2 py-0.5 rounded backdrop-blur-xs">
          인천 서구 경서동
        </div>
        <div className="absolute top-52 right-8 text-[11px] font-bold text-gray-400 bg-slate-900/60 px-2 py-0.5 rounded backdrop-blur-xs">
          김포 사우동
        </div>
        <div className="absolute bottom-48 left-10 text-[11px] font-bold text-gray-400 bg-slate-900/60 px-2 py-0.5 rounded backdrop-blur-xs">
          AA 냉동창고 1.8km
        </div>

        {/* Newly Added Waypoint Label & Flag */}
        {newlyAddedWaypoint && (
          <div className="absolute top-36 right-20 flex flex-col items-end gap-1 z-10">
            <Flag className="w-4 h-4 text-violet-300" fill="currentColor" />
            <div className="text-[11px] font-bold text-violet-200 bg-slate-900/70 px-2 py-0.5 rounded backdrop-blur-xs whitespace-nowrap">
              {newlyAddedWaypoint.clientName}
            </div>
          </div>
        )}

        {/* "경유지 추가됨" Tooltip */}
        {newlyAddedWaypoint && (
          <div className="absolute top-[30%] left-8 z-30 animate-fadeIn">
            <div className="bg-violet-600 text-white text-[11px] font-bold pl-2.5 pr-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-violet-400/50">
              <MapPin className="w-3.5 h-3.5" />
              경유지 추가됨
            </div>
          </div>
        )}

        {/* Speed Limit & Current Speed Display */}
        <div className="absolute top-44 left-4 flex flex-col items-center gap-2">
          {/* Speed Limit Sign */}
          <div className="bg-white text-gray-900 font-extrabold rounded-full w-13 h-13 border-4 border-red-600 flex flex-col items-center justify-center shadow-2xl">
            <span className="text-base leading-tight font-black">60</span>
            <span className="text-[8px] text-red-600 font-extrabold -mt-1">LIMIT</span>
          </div>

          {/* Current Speed Counter */}
          <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700 text-center">
            <div className="text-2xl font-black text-white leading-tight">48</div>
            <div className="text-[9px] text-blue-400 font-bold">km/h</div>
          </div>
        </div>
      </div>

      {/* Top Main Turn Maneuver Banner */}
      <div className="relative z-20 p-4 space-y-2">
        <div className="bg-[#2563EB] rounded-2xl p-4 shadow-2xl flex items-center justify-between text-white border border-blue-400/30">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <NavIcon className="w-7 h-7 rotate-45 text-white" />
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight">380 m</div>
              <p className="text-xs text-blue-100 font-semibold mt-0.5">사우로 / 김포공항 방향</p>
            </div>
          </div>
        </div>

        {/* Sub Maneuver Indicator */}
        <div className="bg-[#1E293B]/90 backdrop-blur-md rounded-xl px-3 py-1.5 text-xs font-bold text-gray-200 inline-flex items-center gap-2 shadow-lg border border-slate-700/50">
          <NavIcon className="w-3.5 h-3.5 text-blue-400 rotate-90" />
          <span>다음: 1.2 km 우회전</span>
        </div>
      </div>

      {/* Right Floating Action Icon Stack */}
      <div className="absolute right-4 top-40 z-30 flex flex-col items-center gap-3">
        {/* 1. Real-time Return Order Recommendation Floating Icon */}
        <div className="relative flex flex-col items-center group">
          <button
            onClick={() => setShowReturnModal(!showReturnModal)}
            className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-[#15803D] to-[#22C55E] text-white flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.5)] active:scale-90 transition-all border-2 border-white"
            title="실시간 복화(회차) 오더 추천"
          >
            <Sparkles className="w-6 h-6 text-white animate-spin-slow" />
            {/* Recommendation Notification Badge */}
            <span className="absolute -top-1 -right-1 bg-[#FEE500] text-gray-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-white shadow-xs">
              {returnOrders.length}
            </span>
          </button>
          <span className="text-[10px] font-extrabold text-emerald-400 mt-1 bg-slate-900/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
            복화추천
          </span>
        </div>

        {/* 2. Mute Toggle Button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="w-11 h-11 rounded-full bg-slate-800/90 text-gray-200 flex items-center justify-center backdrop-blur-md border border-slate-700 shadow-md active:scale-95"
          title="음성 안내"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-gray-400" /> : <Volume2 className="w-5 h-5 text-blue-400" />}
        </button>

        {/* 3. Compass Button */}
        <div className="w-11 h-11 rounded-full bg-slate-800/90 text-red-500 flex items-center justify-center backdrop-blur-md border border-slate-700 shadow-md font-extrabold text-xs">
          <Compass className="w-5 h-5 text-red-500" />
        </div>
      </div>

      {/* Return Order Recommendation Modal / Sheet (Triggered by Icon Click) */}
      {showReturnModal && topReturnOrder && (
        <div className="absolute inset-x-4 top-40 z-40 bg-[#1E293B]/98 backdrop-blur-xl border border-emerald-500/50 rounded-2xl p-4 shadow-2xl space-y-3 animate-fadeIn">
          <div className="flex justify-between items-center pb-2 border-b border-slate-700">
            <div className="flex items-center gap-1.5 text-[#FEE500] font-extrabold text-xs">
              <Zap className="w-4 h-4 fill-[#FEE500]" />
              <span>실시간 복화(회차) 오더 추천</span>
            </div>
            <button
              onClick={() => setShowReturnModal(false)}
              className="w-6 h-6 rounded-full bg-slate-800 text-gray-400 hover:text-white flex items-center justify-center text-xs"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-sm text-white">{topReturnOrder.clientName}</h4>
              <span className="text-base font-extrabold text-emerald-400">
                ₩{topReturnOrder.freightFee.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-300 font-medium">
              {topReturnOrder.origin} → {topReturnOrder.destination}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-1 bg-slate-800/90 p-2.5 rounded-xl text-[11px] text-gray-300 text-center">
            <div>
              <span className="text-[10px] text-gray-400 block">경로 일치</span>
              <strong className="text-white font-bold">{topReturnOrder.matchRatePercent}%</strong>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block">평균 대기</span>
              <strong className="text-emerald-400 font-bold">{topReturnOrder.avgWaitTimeMinutes}분</strong>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block">안전 상태</span>
              <strong className="text-emerald-400 font-bold">위험 없음</strong>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => navigate('/return-orders')}
              className="flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1 active:scale-95 transition-all"
            >
              전체 목록 보기 ({returnOrders.length}건)
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Bottom Status Bar & Arrival Button */}
      <div className="relative z-20 p-4 pb-20 space-y-3">
        <div className="bg-[#0F172A]/95 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/home')}
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-gray-300 hover:text-white active:scale-90 transition-all shrink-0"
              title="주행 안내 종료"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center flex-1 px-2">
              <div className="text-2xl font-black text-white tracking-tight">{durationLabel}</div>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                {totalDistanceKm.toFixed(1)} km • {arrivalLabel} 도착 예정
              </p>
            </div>

            <button
              onClick={() => navigate('/return-orders')}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-gray-200 rounded-xl active:scale-95 transition-all shrink-0"
            >
              경로 옵션
            </button>
          </div>

          {/* Route Stops Stepper */}
          <div className="flex items-start px-1">
            {routeStops.map((stop, idx) => (
              <React.Fragment key={stop.key}>
                <div className="flex flex-col items-center gap-1 w-14 shrink-0">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center border-2 shrink-0 ${
                      stop.kind === 'done' || stop.kind === 'active'
                        ? 'bg-[#2563EB] border-blue-300'
                        : stop.kind === 'new'
                        ? 'bg-violet-500 border-violet-300'
                        : stop.kind === 'final'
                        ? 'bg-transparent border-gray-500'
                        : 'bg-slate-600 border-slate-400'
                    }`}
                  >
                    {stop.kind === 'final' && <Flag className="w-2.5 h-2.5 text-gray-400" />}
                  </span>
                  <span
                    className={`text-[10px] font-bold text-center leading-tight ${
                      stop.kind === 'new' ? 'text-violet-300' : stop.kind === 'final' ? 'text-gray-400' : 'text-gray-200'
                    }`}
                  >
                    {stop.label}
                  </span>
                </div>
                {idx < routeStops.length - 1 &&
                  (routeStops[idx + 1].kind === 'new' ? (
                    <div className="flex-1 border-t-2 border-dashed border-violet-400 mt-2 mx-0.5" />
                  ) : (
                    <div className="flex-1 h-0.5 bg-slate-700 mt-2 mx-0.5" />
                  ))}
              </React.Fragment>
            ))}
          </div>

          {/* Destination Arrival Button */}
          <button
            onClick={() => navigate('/report/voice')}
            className="w-full py-3.5 bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-blue-400/30"
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>도착 (현장경험 남기기)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

