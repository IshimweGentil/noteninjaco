import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-12 h-12 border-t-2 border-gray-100 border-solid rounded-full animate-spin mb-2"></div>
      <div>Loading...</div>
    </div>
  );
};

export default LoadingSpinner;