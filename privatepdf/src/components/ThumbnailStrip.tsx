import React from 'react';
import { useAppStore } from '../modules/state/store';

const ThumbnailStrip: React.FC = () => {
  const { document } = useAppStore();

  if (!document) return null;

  return (
    <div className="p-4">
      <div className="text-center text-gray-500 py-4">
        <div className="text-sm mb-2">Thumbnails</div>
        <div className="text-xs">
          {document.pageCount} pages
        </div>
      </div>
    </div>
  );
};

export default ThumbnailStrip;