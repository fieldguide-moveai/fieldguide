import React from 'react';

export const LoadingSkeleton: React.FC<{ message?: string }> = ({ message = '정보를 불러오는 중입니다...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 space-y-4">
      <div className="w-10 h-10 border-4 border-[#1A2B5C]/20 border-t-[#1A2B5C] rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-gray-600">{message}</p>
    </div>
  );
};
