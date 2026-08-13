import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  showSkip?: boolean;
  onSkip?: () => void;
  showNotification?: boolean;
  step?: number;
  totalSteps?: number;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  showBack = true,
  onBack,
  showSkip = false,
  onSkip,
  showNotification = false,
  step,
  totalSteps = 5,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  const handleSkip = () => {
    if (onSkip) onSkip();
    else navigate('/home');
  };

  return (
    <div className="w-full bg-white sticky top-0 z-30 border-b border-gray-100 shadow-xs">
      <header className="h-14 px-4 max-w-md mx-auto flex items-center justify-between text-[#1A2B5C]">
        {showBack ? (
          <button
            onClick={handleBack}
            className="p-2 -ml-2 text-[#1A2B5C] hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-9" />
        )}

        <h1 className="text-base font-bold text-[#1A2B5C] truncate max-w-[200px] text-center">
          {title}
        </h1>

        {showSkip ? (
          <button
            onClick={handleSkip}
            className="text-xs font-bold text-gray-500 hover:text-[#1A2B5C] px-2 py-1 rounded-md transition-colors"
          >
            Skip
          </button>
        ) : showNotification ? (
          <button
            onClick={() => navigate('/return-orders')}
            className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative"
            aria-label="알림"
          >
            <Bell className="w-5 h-5 text-[#1A2B5C]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#BA1A1A] rounded-full"></span>
          </button>
        ) : (
          <div className="w-9" />
        )}
      </header>

      {step !== undefined && (
        <div className="px-4 pb-3 pt-1 max-w-md mx-auto">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-bold text-gray-500">
              {step} / {totalSteps}
            </span>
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#1A2B5C] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
