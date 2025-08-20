import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { useAppStore } from '../modules/state/store';

interface ErrorBannerProps {
  error: string;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ error }) => {
  const { setError } = useAppStore();

  const handleDismiss = () => {
    setError(null);
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Error
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error}</p>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <button
            type="button"
            className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
            onClick={handleDismiss}
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBanner;