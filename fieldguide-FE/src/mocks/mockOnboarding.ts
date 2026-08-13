import { GuidebookResult, OnboardingAnswers } from '../types';

export function generateGuidebookResult(answers?: Partial<OnboardingAnswers>): GuidebookResult {
  const career = answers?.careerYears || 5;
  const region = answers?.loadingRegions?.[0] || '인천·부천';
  const type = answers?.operationType || '독차';

  return {
    topClients: [
      {
        id: 'c1',
        name: '부천 EE물류센터',
        estWaitTime: '21분',
        entryDifficulty: '쉬움',
        fitScore: '적합도 높음',
        description: `비슷한 차량(${type})과 경력(${career}년차)의 운송인이 초기에 많이 이용했고, 대기시간이 짧아 오더 완료율이 높았습니다.`,
      },
      {
        id: 'c2',
        name: '인천 CC 팩토리',
        estWaitTime: '18분',
        entryDifficulty: '쉬움',
        fitScore: '적합도 높음',
        description: `${region} 지역 핵심 물동량 허브로 하역 스태프 상주, 빠른 정산과 깔끔한 대기 인프라를 제공합니다.`,
      },
      {
        id: 'c3',
        name: 'AA 냉동창고 (김포)',
        estWaitTime: '52분',
        entryDifficulty: '보통',
        fitScore: '적합도 보통',
        description: '오후 시간대 냉동화물 단가가 상대적으로 높은 편이나, 야간/습기 결빙 구간 진입 시 주의가 필요합니다.',
      },
      {
        id: 'c4',
        name: '시흥 남부 물류단지',
        estWaitTime: '30분',
        entryDifficulty: '쉬움',
        fitScore: '적합도 보통',
        description: '공차 이동 거리가 짧고 근거리 회차 오더 매칭률이 높은 베테랑 선호 사업장입니다.',
      },
      {
        id: 'c5',
        name: '남동공단 종합물류센터',
        estWaitTime: '25분',
        entryDifficulty: '보통',
        fitScore: '적합도 보통',
        description: '오전 8시 이전 조기 착지 오더 수락 시 정체 없는 쾌속 상하차가 가능합니다.',
      },
    ],
    earningsSimulation: {
      top20Percent: 240000,
      average: 178000,
      bottom20Percent: 112000,
    },
    veteranPattern: {
      peakAcceptTime: '07~09시',
      avgStartTime: '06:48',
      avgEndTime: '17:32',
      avgDailyOrders: 3.8,
    },
    hourlyAcceptanceDistribution: [
      { hour: '06시', percentage: 15 },
      { hour: '07시', percentage: 75 },
      { hour: '08시', percentage: 85 },
      { hour: '09시', percentage: 65 },
      { hour: '10시', percentage: 30 },
      { hour: '11시', percentage: 20 },
    ],
    aiInsight: `비슷한 조건(${career}년차, ${type})의 베테랑은 오전 첫 오더를 빠르게 잡고, 오후에는 공차 이동이 짧은 회차 오더를 선호하는 경향이 있습니다.`,
  };
}
