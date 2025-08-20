import { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useAppStore } from '../modules/state/store';
import fileManager from '../modules/fileio/file-manager';

const FileDropZone: React.FC = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { setDocument, setLoading, setError } = useAppStore();

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.includes('pdf')) {
      setError('Please select a valid PDF file.');
      return;
    }

    setIsProcessing(true);
    setLoading(true);
    setError(null);

    try {
      const document = await fileManager.openFile(file);
      setDocument(document);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to open PDF file.');
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  }, [setDocument, setLoading, setError]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  return (
    <div className="w-full max-w-2xl mx-auto p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          PrivatePDF
        </h1>
        <p className="text-lg text-gray-600">
          A privacy-first PDF editor that runs entirely in your browser
        </p>
      </div>

      <div
        className={`
          relative border-2 border-dashed rounded-lg p-12 text-center transition-colors
          ${isDragOver 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            {isProcessing ? (
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
            ) : (
              <Upload className="h-16 w-16 text-gray-400" />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isProcessing ? 'Processing PDF...' : 'Drop your PDF here'}
            </h3>
            <p className="text-gray-500">
              {isProcessing 
                ? 'Please wait while we load your document...'
                : 'or click to browse files'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>PDF files only</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span>100% client-side</span>
          </div>
        </div>
      </div>

      {/* Recent files section */}
      <RecentFiles />
    </div>
  );
};

const RecentFiles: React.FC = () => {
  const recentFiles = fileManager.getRecentFiles();
  
  if (recentFiles.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Files</h3>
      <div className="space-y-2">
        {recentFiles.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(file.lastOpened).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              onClick={() => fileManager.openRecentFile(file.id)}
            >
              Open
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileDropZone;