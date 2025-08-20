import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

const OfflineStatus: React.FC = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="text-center p-8">
      <div className="flex justify-center mb-4">
        <WifiOff className="h-16 w-16 text-gray-400" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        You're offline
      </h2>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        PrivatePDF needs an internet connection to load. Please check your connection and try again.
      </p>
      
      <button
        onClick={handleRefresh}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </button>
    </div>
  );
};

export default OfflineStatus;