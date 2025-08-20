import React from 'react';
import { useAppStore } from '../modules/state/store';
import PagesPanel from './PagesPanel';
import FormsPanel from './FormsPanel';

const Sidebar: React.FC = () => {
  const { 
    ui: { sidebarOpen, pagesPanelOpen, formsPanelOpen },
    toggleSidebar,
    togglePagesPanel,
    toggleFormsPanel
  } = useAppStore();

  if (!sidebarOpen) {
    return (
      <button
        onClick={toggleSidebar}
        className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40 bg-primary-600 text-white p-2 rounded-r-lg shadow-lg hover:bg-primary-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Pages</h2>
        <button
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => togglePagesPanel()}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            pagesPanelOpen 
              ? 'text-primary-600 border-b-2 border-primary-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Pages
        </button>
        <button
          onClick={() => toggleFormsPanel()}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            formsPanelOpen 
              ? 'text-primary-600 border-b-2 border-primary-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Forms
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {pagesPanelOpen && <PagesPanel />}
        {formsPanelOpen && <FormsPanel />}
      </div>
    </div>
  );
};

export default Sidebar;