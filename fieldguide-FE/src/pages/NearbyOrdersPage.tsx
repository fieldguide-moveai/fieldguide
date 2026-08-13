import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getNearbyOrders, getReturnOrders } from '../services/orderService';
import { Order } from '../types';
import { MobileHeader } from '../components/MobileHeader';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorFallback } from '../components/ErrorFallback';
import {
  MapPin,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  SlidersHorizontal,
  Search,
  ArrowUpDown,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const NearbyOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { userInfo } = useApp();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'match' | 'fee' | 'distance'>('match');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNearbyOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || '주변 맞춤 추천 오더를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter & Sort Logic
  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.destination.toLowerCase().includes(searchQuery.toLowerCase());
      if (selectedCategory === '전체') return matchesSearch;
      if (selectedCategory === '위험없음') return matchesSearch && order.riskCount === 0;
      if (selectedCategory === '고운임') return matchesSearch && order.freightFee >= 180000;
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'fee') return b.freightFee - a.freightFee;
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      return (b.matchRatePercent || 0) - (a.matchRatePercent || 0);
    });

  return (
    <div className="min-h-screen bg-[#F5F6F8] pb-28 w-full max-w-md mx-auto shadow-lg">
      <MobileHeader title="주변 맞춤 추천 오더" showBack={false} showNotification={true} />

      <main className="p-4 space-y-3.5">
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-[#1A2B5C] to-[#2E4A88] text-white rounded-2xl p-4 shadow-sm space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="bg-[#FFF5D6] text-[#B68D00] px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#F59E0B]" />
              실시간 AI 맞춤 매칭
            </span>
            <span className="text-xs text-blue-200 font-medium">{userInfo.truckType}</span>
          </div>
          <h2 className="text-base font-bold">
            {userInfo.name} 기사님 주변 추천 오더
          </h2>
          <p className="text-xs text-blue-100">
            기사님의 운행 가이드북 및 현재 GPS 동선 기반
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="화주명, 출발지, 도착지 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F5F6F8] pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#1A2B5C]"
          />
        </div>

        {/* Filter Pills & Sort Options */}
        <div className="flex justify-between items-center pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['전체', '위험없음', '고운임'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#1A2B5C] text-white shadow-xs'
                    : 'bg-[#F5F6F8] text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1 text-xs text-gray-600 font-bold shrink-0 ml-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent font-bold text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="match">일치율순</option>
              <option value="fee">운임높은순</option>
              <option value="distance">거리가까운순</option>
            </select>
          </div>
        </div>

        {loading && <LoadingSkeleton message="주변 맞춤 오더 실시간 수집 중..." />}

        {error && <ErrorFallback message={error} onRetry={fetchOrders} />}

        {!loading && !error && (
          <div className="space-y-3 pt-1">
            <div className="flex justify-between items-center text-xs text-gray-500 font-medium px-1">
              <span>총 <strong className="text-gray-900 font-bold">{filteredOrders.length}</strong>건 추천됨</span>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                실시간 업데이트
              </span>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-gray-500 border border-gray-200 space-y-2">
                <p className="text-sm font-bold">검색 조건에 해당되는 오더가 없습니다.</p>
                <p className="text-xs text-gray-400">검색어나 필터를 변경해보세요.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => navigate(`/order/${order.id}`)}
                  className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs hover:border-[#1A2B5C] cursor-pointer transition-all active:scale-[0.99] space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-[#FEE500] text-gray-900 px-2 py-0.5 rounded text-[10px] font-bold">
                          추천
                        </span>
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold">
                          {order.cargoType}
                        </span>
                        {order.matchRatePercent && (
                          <span className="text-[11px] font-bold text-[#2E7D32]">
                            동선 {order.matchRatePercent}% 일치
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-base text-gray-900">
                        {order.clientName}
                      </h3>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">
                      {order.distanceKm}km
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-xs text-gray-600 font-medium">
                      {order.origin} → {order.destination}
                    </span>
                    <div className="text-right">
                      <span className="text-xl font-extrabold text-[#1A2B5C]">
                        {order.freightFee.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-gray-600 ml-0.5">원</span>
                    </div>
                  </div>

                  {/* Operational & Safety Badges */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                    <span className="inline-flex items-center gap-1 text-gray-600 font-medium">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      평균 대기 {order.avgWaitTimeMinutes}분
                    </span>

                    {order.riskCount > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[#BA1A1A] font-bold bg-red-50 px-2 py-0.5 rounded-md text-[11px]">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        위험 보고 {order.riskCount}건
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[#2E7D32] font-bold bg-green-50 px-2 py-0.5 rounded-md text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        위험 보고 없음
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};
