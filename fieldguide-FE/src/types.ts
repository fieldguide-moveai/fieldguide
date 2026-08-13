export interface UserProfile {
  id: string;
  name: string;
  truckType: string; // e.g. "5톤 카고"
  truckNumber: string;
  careerYears: number;
  points: number;
  preferredRegion: string[];
  operationType: '독차' | '혼적' | '전체';
  workTimeStart: string;
  workTimeEnd: string;
  radiusKm: number;
}

export interface TodaySummary {
  completedOrdersCount: number;
  todayIncome: number;
  totalDistanceKm: number;
  activeHours: number;
}

export interface HubKnowledge {
  id: string;
  hubId: string;
  type: 'operation' | 'safety';
  title: string;
  content: string;
  reportedAt: string;
  reporterExperience: string;
  upvotes: number;
  validationsCount: number;
  status?: 'confirmed' | 'caution' | 'danger';
}

export interface HubInfo {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  avgWaitTimeMinutes: number;
  entryDifficulty: '쉬움' | '보통' | '어려움';
  safetyWarningCount: number;
  knowledgeList: HubKnowledge[];
}

export interface Order {
  id: string;
  clientName: string;
  hubId: string;
  origin: string;
  destination: string;
  distanceKm: number;
  freightFee: number;
  cargoType: '일반' | '냉동' | '냉장' | '대형';
  isRecommended?: boolean;
  matchRatePercent?: number;
  avgWaitTimeMinutes: number;
  riskCount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'in_transit' | 'completed';
  aiRecommendationReason?: string;
}

export interface CostBreakdown {
  orderId: string;
  freightFee: number;
  emptyDistanceFuelCost: number; // 공차 이동 연료비
  transitFuelCost: number;        // 운행 연료비
  estimatedTollCost: number;      // 톨비 추정
  platformFee: number;            // 수수료(10.8%)
  estimatedNetPay: number;        // 예상 실수령액
  calculatedAtLocation: string;   // 기사 현재 위치
}

export interface OnboardingAnswers {
  careerYears: number;
  loadingRegions: string[];
  unloadingRegions: string[];
  radiusKm: number;
  operationType: '독차' | '혼적';
  preferredStartTime: string;
  preferredEndTime: string;
}

export interface GuidebookResult {
  topClients: Array<{
    id: string;
    name: string;
    estWaitTime: string;
    entryDifficulty: '쉬움' | '보통' | '어려움';
    fitScore: '적합도 높음' | '적합도 보통';
    description: string;
  }>;
  earningsSimulation: {
    top20Percent: number;
    average: number;
    bottom20Percent: number;
  };
  veteranPattern: {
    peakAcceptTime: string; // e.g. "07~09시"
    avgStartTime: string;  // e.g. "06:48"
    avgEndTime: string;    // e.g. "17:32"
    avgDailyOrders: number; // e.g. 3.8
  };
  hourlyAcceptanceDistribution: Array<{
    hour: string; // "06시", "07시", ...
    percentage: number;
  }>;
  aiInsight: string;
}

export interface VoiceReportResult {
  reportId: string;
  tags: string[];
  summary: string;
  pointsEarned: number;
  timestamp: string;
}

export interface HubValidationResponse {
  knowledgeId: string;
  response: 'agree' | 'disagree' | 'resolved' | string;
  submittedAt: string;
}
