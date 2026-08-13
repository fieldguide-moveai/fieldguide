import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ClipboardList, BookOpen, Megaphone, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  // Do not show BottomNav during step-by-step onboarding
  const isStepOnboarding = currentPath.startsWith('/onboarding/') && currentPath !== '/onboarding/result';
  if (isStepOnboarding) {
    return null;
  }

  const tabs = [
    { id: 'home', label: '홈', path: '/home', icon: Home },
    { id: 'orders', label: '오더', path: '/orders', icon: ClipboardList },
    { id: 'guidebook', label: '가이드북', path: '/onboarding/result', icon: BookOpen },
    { id: 'mypage', label: '마이', path: '/mypage', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 w-full max-w-md mx-auto bg-white border-t border-gray-200/80 px-3 py-2 flex justify-around items-center shadow-[0px_-4px_20px_rgba(0,0,0,0.06)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive =
          currentPath === tab.path ||
          (tab.id === 'orders' && (currentPath === '/orders' || currentPath === '/return-orders' || currentPath.startsWith('/order')));

        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-150 active:scale-95 ${
              isActive ? 'text-[#1A2B5C]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-[#1A2B5C] stroke-[2.5]' : 'text-gray-400 stroke-[1.8]'}`} />
            <span className={`text-[10px] mt-1 ${isActive ? 'text-[#1A2B5C] font-bold' : 'text-gray-500 font-medium'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

