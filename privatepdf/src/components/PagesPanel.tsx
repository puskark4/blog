import React from 'react';
import { useAppStore } from '../modules/state/store';

const PagesPanel: React.FC = () => {
  const { document } = useAppStore();

  if (!document) return null;

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="text-center text-gray-500 py-8">
        <div className="text-lg mb-2">Pages Panel</div>
        <div className="text-sm">
          {document.pageCount} pages loaded
        </div>
      </div>
    </div>
  );
};

export default PagesPanel;