import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      <div className="text-center">
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          Loading PDF...
        </h2>
        <p className="text-gray-500">
          Please wait while we process your document
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;