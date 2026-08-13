import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorFallbackProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  message = '정보를 불러오지 못했습니다. 다시 시도해주세요.',
  onRetry,
}) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-5 my-4 text-center space-y-3">
      <div className="flex justify-center text-[#BA1A1A]">
        <AlertCircle className="w-8 h-8" />
      </div>
      <p className="text-sm font-semibold text-[#BA1A1A]">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1A2B5C] text-white text-xs font-bold rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          다시 시도
        </button>
      )}
    </div>
  );
};
