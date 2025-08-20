// Core document state
export interface DocumentState {
  id: string; // uuid
  name: string;
  pageCount: number;
  pages: PageState[];
  forms: FormFieldState[]; // snapshot
  overlays: OverlayByPage; // pageIndex -> Overlay[]
  pdfBytes: ArrayBuffer; // original or last-saved base
  modifiedAt: number;
}

export interface PageState {
  index: number;
  widthPt: number; // pdf-lib points
  heightPt: number;
  rotation: 0 | 90 | 180 | 270;
}

export type OverlayByPage = Record<number, Overlay[]>;

export type Overlay = TextOverlay | RectOverlay | HighlightOverlay | ArrowOverlay | InkOverlay | ImageOverlay;

export interface BaseOverlay {
  id: string; 
  pageIndex: number; 
  locked?: boolean; 
  z: number; 
  opacity: number;
}

export interface TextOverlay extends BaseOverlay {
  kind: 'text';
  x: number; 
  y: number; // PDF points
  text: string; 
  fontFamily: 'Helvetica' | 'Inter' | 'Times'; 
  fontSize: number; 
  bold?: boolean; 
  italic?: boolean;
}

export interface RectOverlay extends BaseOverlay {
  kind: 'rect';
  x: number; 
  y: number; 
  w: number; 
  h: number; 
  stroke: number; 
  fill?: boolean;
}

export interface HighlightOverlay extends BaseOverlay {
  kind: 'highlight';
  quads: { x: number; y: number; w: number; h: number; }[]; // multiple rects
}

export interface ArrowOverlay extends BaseOverlay {
  kind: 'arrow';
  x1: number; 
  y1: number; 
  x2: number; 
  y2: number; 
  stroke: number;
}

export interface InkOverlay extends BaseOverlay {
  kind: 'ink';
  path: { x: number; y: number; }[]; 
  stroke: number;
}

export interface ImageOverlay extends BaseOverlay {
  kind: 'image';
  x: number; 
  y: number; 
  w: number; 
  h: number; 
  mime: 'image/png' | 'image/jpeg' | 'image/svg+xml'; 
  dataUrl: string;
}

export interface FormFieldState {
  name: string; 
  type: 'text' | 'checkbox' | 'radio' | 'dropdown'; 
  pageIndex: number;
  value?: string | boolean;
}

// Coordinate conversion types
export interface ViewportInfo { 
  scale: number; 
  widthPx: number; 
  heightPx: number; 
}

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  w: number;
  h: number;
}

// Tool types
export type ToolType = 'select' | 'text' | 'rect' | 'highlight' | 'arrow' | 'ink' | 'image';

export interface ToolState {
  activeTool: ToolType;
  isDrawing: boolean;
  selectedOverlayId: string | null;
}

// File operations
export interface FileInfo {
  name: string;
  size: number;
  lastOpened: number;
  id: string;
}

export interface SaveOptions {
  flattenForms: boolean;
  includeOverlays: boolean;
}

// UI State
export interface UIState {
  sidebarOpen: boolean;
  propertiesPanelOpen: boolean;
  formsPanelOpen: boolean;
  pagesPanelOpen: boolean;
  zoom: number;
  currentPage: number;
  theme: 'light' | 'dark';
}

// PWA State
export interface PWAState {
  isInstalled: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
}