import React from 'react';
import { 
  MousePointer, 
  Type, 
  Square, 
  Highlighter, 
  ArrowRight, 
  PenTool, 
  Image 
} from 'lucide-react';
import { useAppStore } from '../modules/state/store';
import type { ToolType } from '../types';

const tools: Array<{
  id: ToolType;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  shortcut: string;
}> = [
  { id: 'select', icon: MousePointer, label: 'Select', shortcut: 'V' },
  { id: 'text', icon: Type, label: 'Text', shortcut: 'T' },
  { id: 'rect', icon: Square, label: 'Rectangle', shortcut: 'R' },
  { id: 'highlight', icon: Highlighter, label: 'Highlight', shortcut: 'H' },
  { id: 'arrow', icon: ArrowRight, label: 'Arrow', shortcut: 'A' },
  { id: 'ink', icon: PenTool, label: 'Pen', shortcut: 'P' },
  { id: 'image', icon: Image, label: 'Image', shortcut: 'I' },
];

const ToolSelector: React.FC = () => {
  const { tools: toolState, setActiveTool } = useAppStore();

  const handleToolSelect = (toolId: ToolType) => {
    setActiveTool(toolId);
  };

  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
      {tools.map((tool) => {
        const isActive = toolState.activeTool === tool.id;
        const Icon = tool.icon;
        
        return (
          <button
            key={tool.id}
            onClick={() => handleToolSelect(tool.id)}
            className={`
              relative p-2 rounded-md transition-colors duration-200 group
              ${isActive 
                ? 'bg-white text-primary-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }
            `}
            title={`${tool.label} (${tool.shortcut})`}
          >
            <Icon className="h-5 w-5" />
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {tool.label} ({tool.shortcut})
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ToolSelector;