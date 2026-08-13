import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { BottomNav } from './components/BottomNav';
import { HubAlertModal } from './components/HubAlertModal';

import { OnboardingCareer } from './pages/OnboardingCareer';
import { OnboardingRegion } from './pages/OnboardingRegion';
import { OnboardingType } from './pages/OnboardingType';
import { OnboardingTime } from './pages/OnboardingTime';
import { OnboardingResult } from './pages/OnboardingResult';
import { HomeDashboard } from './pages/HomeDashboard';
import { OrderProposal } from './pages/OrderProposal';
import { SiteInfo } from './pages/SiteInfo';
import { Navigation } from './pages/Navigation';
import { ReturnOrders } from './pages/ReturnOrders';
import { VoiceReport } from './pages/VoiceReport';
import { VoiceReportComplete } from './pages/VoiceReportComplete';
import { MyPage } from './pages/MyPage';
import { NearbyOrdersPage } from './pages/NearbyOrdersPage';
import { Notifications } from './pages/Notifications';
import { TodayRunDetail } from './pages/TodayRunDetail';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#F5F6F8] flex items-center justify-center font-sans antialiased text-[#1A1C1E]">
          {/* Centered Mobile Screen Container */}
          <div className="w-full max-w-md min-h-screen bg-white relative shadow-2xl overflow-x-hidden border-x border-gray-200/80">
            <Routes>
              {/* Default Redirect to Onboarding Step 1 */}
              <Route path="/" element={<Navigate to="/onboarding/career" replace />} />

              {/* Onboarding Flow (5 Steps) */}
              <Route path="/onboarding/career" element={<OnboardingCareer />} />
              <Route path="/onboarding/region" element={<OnboardingRegion />} />
              <Route path="/onboarding/type" element={<OnboardingType />} />
              <Route path="/onboarding/time" element={<OnboardingTime />} />
              <Route path="/onboarding/result" element={<OnboardingResult />} />

              {/* Main App Views */}
              <Route path="/home" element={<HomeDashboard />} />
              <Route path="/orders" element={<NearbyOrdersPage />} />
              <Route path="/order/:orderId" element={<OrderProposal />} />
              <Route path="/order/:orderId/site-info" element={<SiteInfo />} />
              <Route path="/order/:orderId/navigation" element={<Navigation />} />
              <Route path="/return-orders" element={<ReturnOrders />} />
              <Route path="/report/voice" element={<VoiceReport />} />
              <Route path="/report/complete" element={<VoiceReportComplete />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/today-summary" element={<TodayRunDetail />} />

              {/* Catch-all Fallback */}
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>

            {/* Persistent Navigation Bar & Hub Verification Alert Modal */}
            <BottomNav />
            <HubAlertModal />
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
