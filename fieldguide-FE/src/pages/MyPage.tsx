import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MobileHeader } from '../components/MobileHeader';
import {
  User,
  Truck,
  Sparkles,
  BookOpen,
  ClipboardList,
  Mic,
  Gift,
  ChevronRight,
  Settings,
  HelpCircle,
} from 'lucide-react';

export const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const { userInfo } = useApp();

  return (
    <div className="min-h-screen bg-[#F5F6F8] pb-24 w-full max-w-md mx-auto shadow-lg">
      <MobileHeader title="마이 페이지" showBack={false} showNotification={true} />

      <main className="p-4 space-y-4">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#1A2B5C] text-white flex items-center justify-center text-xl font-bold">
              {userInfo.name.slice(0, 1)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-gray-900">{userInfo.name} 기사님</h2>
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded">
                  {userInfo.careerYears}년차
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                {userInfo.truckType} • {userInfo.truckNumber}
              </p>
            </div>
          </div>

          <div className="bg-[#FFF5D6] border border-[#FEE500] rounded-xl p-3.5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-bold text-gray-800">보유 포인트</span>
            </div>
            <span className="text-lg font-extrabold text-[#1A2B5C]">
              {userInfo.points.toLocaleString()} P
            </span>
          </div>
        </div>

        {/* Quick Menu List */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100 shadow-xs text-xs">
          <button
            onClick={() => navigate('/onboarding/career')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 text-left"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 text-[#1A2B5C]" />
              <span className="font-bold text-gray-800">운송 가이드 재설정</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => navigate('/return-orders')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 text-left"
          >
            <div className="flex items-center gap-3">
              <ClipboardList className="w-4 h-4 text-[#1A2B5C]" />
              <span className="font-bold text-gray-800">추천 회차 오더 목록</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => navigate('/report/voice')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 text-left"
          >
            <div className="flex items-center gap-3">
              <Mic className="w-4 h-4 text-[#2E7D32]" />
              <span className="font-bold text-gray-800">현장 Near Miss 음성 제보하기</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <Gift className="w-4 h-4 text-[#F59E0B]" />
              <span className="font-bold text-gray-800">주유 / 세차 쿠폰 교환소</span>
            </div>
            <span className="text-[11px] text-blue-600 font-bold">준비 중</span>
          </div>
        </div>

        {/* App Settings */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100 shadow-xs text-xs">
          <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-700">앱 설정 및 알림</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-700">고객센터 및 현장 제보 가이드</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </main>
    </div>
  );
};
