import React from 'react';
import { useAppStore } from '../modules/state/store';
import PdfViewer from './PdfViewer';

const MainContent: React.FC = () => {
  const { document, ui } = useAppStore();

  if (!document) return null;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Page navigation */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            className="btn btn-secondary px-3 py-1"
            disabled={ui.currentPage === 0}
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600">
            Page {ui.currentPage + 1} of {document.pageCount}
          </span>
          
          <button
            className="btn btn-secondary px-3 py-1"
            disabled={ui.currentPage === document.pageCount - 1}
          >
            Next
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          {document.name}
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto bg-gray-100">
        <PdfViewer />
      </div>
    </div>
  );
};

export default MainContent;