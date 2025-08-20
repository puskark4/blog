import React from 'react';
import { useAppStore } from '../modules/state/store';

const PdfViewer: React.FC = () => {
  const { document, ui } = useAppStore();

  if (!document) return null;

  const currentPage = document.pages[ui.currentPage];
  if (!currentPage) return null;

  return (
    <div className="flex items-center justify-center min-h-full p-8">
      <div className="text-center">
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 mb-4">
          <div className="text-gray-400 text-lg mb-2">
            PDF Viewer Placeholder
          </div>
          <div className="text-gray-500 text-sm">
            Page {ui.currentPage + 1} - {currentPage.widthPt.toFixed(0)} × {currentPage.heightPt.toFixed(0)} pts
          </div>
        </div>
        <p className="text-gray-600">
          PDF.js integration will be implemented here
        </p>
      </div>
    </div>
  );
};

export default PdfViewer;