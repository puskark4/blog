import React from 'react';
import { useAppStore } from '../modules/state/store';
import Toolbar from './Toolbar';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import PropertiesPanel from './PropertiesPanel';

const AppShell: React.FC = () => {
  const { 
    ui: { propertiesPanelOpen },
    document 
  } = useAppStore();

  if (!document) return null;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Toolbar */}
      <Toolbar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />
        
        {/* Center Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <MainContent />
        </div>
        
        {/* Right Properties Panel */}
        {propertiesPanelOpen && (
          <PropertiesPanel />
        )}
      </div>
    </div>
  );
};

export default AppShell;