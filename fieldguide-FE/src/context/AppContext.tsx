import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, TodaySummary, OnboardingAnswers, Order } from '../types';
import { MOCK_USER_PROFILE, MOCK_TODAY_SUMMARY } from '../mocks/mockUser';
import { MOCK_ORDERS } from '../mocks/mockOrders';

interface HubAlertModalState {
  isOpen: boolean;
  type: 'operational' | 'safety';
  knowledgeId: string;
  hubName: string;
  question?: string;
  beforeText?: string;
  afterText?: string;
  quoteText?: string;
}

interface AppContextType {
  userInfo: UserProfile;
  todaySummary: TodaySummary;
  onboardingAnswers: OnboardingAnswers;
  currentOrder: Order | null;
  hubAlertModal: HubAlertModalState;
  setOnboardingAnswers: React.Dispatch<React.SetStateAction<OnboardingAnswers>>;
  setCurrentOrder: (order: Order | null) => void;
  addPoints: (pts: number) => void;
  openHubAlert: (modalState: Omit<HubAlertModalState, 'isOpen'>) => void;
  closeHubAlert: () => void;
}

const defaultOnboardingAnswers: OnboardingAnswers = {
  careerYears: 5,
  loadingRegions: ['서울 전체', '강남구', '인천 서구'],
  unloadingRegions: ['경기도 김포시', '부천시'],
  radiusKm: 35,
  operationType: '독차',
  preferredStartTime: '06:00',
  preferredEndTime: '18:00',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserProfile>(MOCK_USER_PROFILE);
  const [todaySummary, setTodaySummary] = useState<TodaySummary>(MOCK_TODAY_SUMMARY);
  const [onboardingAnswers, setOnboardingAnswers] = useState<OnboardingAnswers>(defaultOnboardingAnswers);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(MOCK_ORDERS[0]);
  const [hubAlertModal, setHubAlertModal] = useState<HubAlertModalState>({
    isOpen: false,
    type: 'operational',
    knowledgeId: 'kn_gimpo_op1',
    hubName: 'AA 냉동창고 (김포)',
    beforeText: '평균 대기시간 40분',
    afterText: '실시간 대기시간 18분으로 감소',
    quoteText: '야간 좌측 조명 불량 및 회전반경 좁음',
  });

  const addPoints = (pts: number) => {
    setUserInfo(prev => ({ ...prev, points: prev.points + pts }));
  };

  const openHubAlert = (modalState: Omit<HubAlertModalState, 'isOpen'>) => {
    setHubAlertModal({ ...modalState, isOpen: true });
  };

  const closeHubAlert = () => {
    setHubAlertModal(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <AppContext.Provider
      value={{
        userInfo,
        todaySummary,
        onboardingAnswers,
        currentOrder,
        hubAlertModal,
        setOnboardingAnswers,
        setCurrentOrder,
        addPoints,
        openHubAlert,
        closeHubAlert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
