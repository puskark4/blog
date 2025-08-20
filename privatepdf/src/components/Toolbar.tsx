import React from 'react';
import { 
  FolderOpen, 
  Save, 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Settings
} from 'lucide-react';
import { useAppStore } from '../modules/state/store';
import fileManager from '../modules/fileio/file-manager';
import ToolSelector from './ToolSelector';

const Toolbar: React.FC = () => {
  const { 
    document: pdfDocument, 
    ui,
    canUndo, 
    canRedo,
    undo, 
    redo,
    setZoom
  } = useAppStore();

  const handleOpenFile = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        try {
          const newDoc = await fileManager.openFile(target.files[0]);
          useAppStore.getState().setDocument(newDoc);
        } catch (error) {
          useAppStore.getState().setError(error instanceof Error ? error.message : 'Failed to open file');
        }
      }
    };
    input.click();
  };

  const handleSave = async () => {
    if (!pdfDocument) return;
    
    try {
      const blob = await fileManager.saveFile(pdfDocument, {
        flattenForms: false,
        includeOverlays: true,
      });
      
      await fileManager.saveToFileSystem(blob, pdfDocument.name.replace('.pdf', '_edited.pdf'));
    } catch (error) {
      useAppStore.getState().setError('Failed to save file');
    }
  };

  const handleSaveFlattened = async () => {
    if (!pdfDocument) return;
    
    try {
      const blob = await fileManager.saveFile(pdfDocument, {
        flattenForms: true,
        includeOverlays: true,
      });
      
      await fileManager.saveToFileSystem(blob, pdfDocument.name.replace('.pdf', '_flattened.pdf'));
    } catch (error) {
      useAppStore.getState().setError('Failed to save file');
    }
  };

  const handleZoomIn = () => {
    setZoom(Math.min(ui.zoom * 1.2, 5));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(ui.zoom / 1.2, 0.1));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  return (
    <div className="toolbar bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Left side - File operations */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleOpenFile}
            className="btn btn-secondary flex items-center space-x-2"
            title="Open PDF (Ctrl+O)"
          >
            <FolderOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Open</span>
          </button>
          
          <div className="relative group">
            <button
              onClick={handleSave}
              className="btn btn-primary flex items-center space-x-2"
              title="Save (Ctrl+S)"
            >
              <Save className="h-4 w-4" />
              <span className="text-sm">Save</span>
            </button>
            
            {/* Save options dropdown */}
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-1">
                <button
                  onClick={handleSave}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Save with Editable Forms
                </button>
                <button
                  onClick={handleSaveFlattened}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Save Flattened
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Tool selector */}
        <div className="flex items-center space-x-2">
          <ToolSelector />
        </div>

        {/* Right side - Navigation and controls */}
        <div className="flex items-center space-x-2">
          {/* Undo/Redo */}
          <button
            onClick={undo}
            disabled={!canUndo}
            className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </button>
          
          <button
            onClick={redo}
            disabled={!canRedo}
            className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </button>

          {/* Zoom controls */}
          <div className="flex items-center space-x-1 border-l border-gray-300 pl-3 ml-3">
            <button
              onClick={handleZoomOut}
              className="btn btn-secondary p-2"
              title="Zoom Out (Ctrl+-)"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            
            <span className="text-sm text-gray-600 min-w-[3rem] text-center">
              {Math.round(ui.zoom * 100)}%
            </span>
            
            <button
              onClick={handleZoomIn}
              className="btn btn-secondary p-2"
              title="Zoom In (Ctrl+=)"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleResetZoom}
              className="btn btn-secondary p-2"
              title="Reset Zoom (Ctrl+0)"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* Settings */}
          <button
            className="btn btn-secondary p-2"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;