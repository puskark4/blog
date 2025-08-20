import React from 'react';
import { useAppStore } from '../modules/state/store';

const PropertiesPanel: React.FC = () => {
  const { togglePropertiesPanel } = useAppStore();

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
        <button
          onClick={togglePropertiesPanel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Panel Content */}
      <div className="flex-1 p-4">
        <div className="text-center text-gray-500 py-8">
          <div className="text-lg mb-2">Properties Panel</div>
          <div className="text-sm">
            Select an overlay to edit its properties
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;