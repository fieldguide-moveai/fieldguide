import { UserProfile, TodaySummary } from '../types';

export const MOCK_USER_PROFILE: UserProfile = {
  id: 'driver_7749',
  name: '김베테랑',
  truckType: '5톤 카고',
  truckNumber: '경기82아 3948',
  careerYears: 7,
  points: 1250,
  preferredRegion: ['인천시 서구', '경기도 김포시', '부천시'],
  operationType: '독차',
  workTimeStart: '06:00',
  workTimeEnd: '18:00',
  radiusKm: 35,
};

export const MOCK_TODAY_SUMMARY: TodaySummary = {
  completedOrdersCount: 2,
  todayIncome: 184000,
  totalDistanceKm: 142.5,
  activeHours: 5.2,
};
