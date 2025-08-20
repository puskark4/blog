import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { 
  DocumentState, 
  ToolState, 
  UIState, 
  PWAState, 
  Overlay, 
  PageState,
  ToolType 
} from '../../types';

interface AppState {
  // Document state
  document: DocumentState | null;
  isLoading: boolean;
  error: string | null;
  
  // Tool state
  tools: ToolState;
  
  // UI state
  ui: UIState;
  
  // PWA state
  pwa: PWAState;
  
  // Actions
  setDocument: (doc: DocumentState | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Tool actions
  setActiveTool: (tool: ToolType) => void;
  setDrawing: (drawing: boolean) => void;
  selectOverlay: (id: string | null) => void;
  
  // UI actions
  toggleSidebar: () => void;
  togglePropertiesPanel: () => void;
  toggleFormsPanel: () => void;
  togglePagesPanel: () => void;
  setZoom: (zoom: number) => void;
  setCurrentPage: (page: number) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  
  // PWA actions
  setPWAState: (state: Partial<PWAState>) => void;
  
  // Document actions
  addOverlay: (overlay: Overlay) => void;
  updateOverlay: (id: string, updates: Partial<Overlay>) => void;
  deleteOverlay: (id: string) => void;
  moveOverlay: (id: string, newPageIndex: number) => void;
  
  // Form actions
  updateFormField: (name: string, value: string | boolean) => void;
  
  // Page actions
  rotatePage: (pageIndex: number, rotation: 0 | 90 | 180 | 270) => void;
  deletePage: (pageIndex: number) => void;
  insertPage: (pageIndex: number, page: PageState) => void;
  reorderPages: (newOrder: number[]) => void;
  
  // Undo/Redo
  history: DocumentState[];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  saveToHistory: () => void;
  undo: () => void;
  redo: () => void;
}

const MAX_HISTORY = 50;

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      // Initial state
      document: null,
      isLoading: false,
      error: null,
      
      tools: {
        activeTool: 'select',
        isDrawing: false,
        selectedOverlayId: null,
      },
      
      ui: {
        sidebarOpen: true,
        propertiesPanelOpen: true,
        formsPanelOpen: false,
        pagesPanelOpen: false,
        zoom: 1,
        currentPage: 0,
        theme: 'light',
      },
      
      pwa: {
        isInstalled: false,
        isOnline: navigator.onLine,
        updateAvailable: false,
      },
      
      history: [],
      historyIndex: -1,
      canUndo: false,
      canRedo: false,
      
      // Actions
      setDocument: (doc) => set({ document: doc }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      
      setActiveTool: (tool) => set((state) => ({
        tools: { ...state.tools, activeTool: tool }
      })),
      
      setDrawing: (drawing) => set((state) => ({
        tools: { ...state.tools, isDrawing: drawing }
      })),
      
      selectOverlay: (id) => set((state) => ({
        tools: { ...state.tools, selectedOverlayId: id }
      })),
      
      toggleSidebar: () => set((state) => ({
        ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen }
      })),
      
      togglePropertiesPanel: () => set((state) => ({
        ui: { ...state.ui, propertiesPanelOpen: !state.ui.propertiesPanelOpen }
      })),
      
      toggleFormsPanel: () => set((state) => ({
        ui: { ...state.ui, formsPanelOpen: !state.ui.formsPanelOpen }
      })),
      
      togglePagesPanel: () => set((state) => ({
        ui: { ...state.ui, pagesPanelOpen: !state.ui.pagesPanelOpen }
      })),
      
      setZoom: (zoom) => set((state) => ({
        ui: { ...state.ui, zoom }
      })),
      
      setCurrentPage: (page) => set((state) => ({
        ui: { ...state.ui, currentPage: page }
      })),
      
      setTheme: (theme) => set((state) => ({
        ui: { ...state.ui, theme }
      })),
      
      setPWAState: (pwaState) => set((state) => ({
        pwa: { ...state.pwa, ...pwaState }
      })),
      
      addOverlay: (overlay) => set((state) => {
        if (!state.document) return state;
        
        const newOverlays = { ...state.document.overlays };
        if (!newOverlays[overlay.pageIndex]) {
          newOverlays[overlay.pageIndex] = [];
        }
        newOverlays[overlay.pageIndex].push(overlay);
        
        const newDocument = {
          ...state.document,
          overlays: newOverlays,
          modifiedAt: Date.now(),
        };
        
        return { document: newDocument };
      }),
      
      updateOverlay: (id, updates) => set((state) => {
        if (!state.document) return state;
        
        const newOverlays = { ...state.document.overlays };
        let found = false;
        
        Object.keys(newOverlays).forEach((pageIndex) => {
          const pageOverlays = newOverlays[parseInt(pageIndex)];
          const overlayIndex = pageOverlays.findIndex(o => o.id === id);
          if (overlayIndex !== -1) {
            newOverlays[parseInt(pageIndex)] = [
              ...pageOverlays.slice(0, overlayIndex),
              { ...pageOverlays[overlayIndex], ...updates } as Overlay,
              ...pageOverlays.slice(overlayIndex + 1)
            ];
            found = true;
          }
        });
        
        if (!found) return state;
        
        const newDocument = {
          ...state.document,
          overlays: newOverlays,
          modifiedAt: Date.now(),
        };
        
        return { document: newDocument };
      }),
      
      deleteOverlay: (id) => set((state) => {
        if (!state.document) return state;
        
        const newOverlays = { ...state.document.overlays };
        let found = false;
        
        Object.keys(newOverlays).forEach((pageIndex) => {
          const pageOverlays = newOverlays[parseInt(pageIndex)];
          const overlayIndex = pageOverlays.findIndex(o => o.id === id);
          if (overlayIndex !== -1) {
            newOverlays[parseInt(pageIndex)] = [
              ...pageOverlays.slice(0, overlayIndex),
              ...pageOverlays.slice(overlayIndex + 1)
            ];
            found = true;
          }
        });
        
        if (!found) return state;
        
        const newDocument = {
          ...state.document,
          overlays: newOverlays,
          modifiedAt: Date.now(),
        };
        
        return { document: newDocument };
      }),
      
      moveOverlay: (id, newPageIndex) => set((state) => {
        if (!state.document) return state;
        
        const newOverlays = { ...state.document.overlays };
        let overlay: Overlay | null = null;
        let oldPageIndex: number | null = null;
        
        // Find and remove overlay from old page
        Object.keys(newOverlays).forEach((pageIndex) => {
          const pageOverlays = newOverlays[parseInt(pageIndex)];
          const overlayIndex = pageOverlays.findIndex(o => o.id === id);
          if (overlayIndex !== -1) {
            overlay = pageOverlays[overlayIndex];
            oldPageIndex = parseInt(pageIndex);
            newOverlays[parseInt(pageIndex)] = [
              ...pageOverlays.slice(0, overlayIndex),
              ...pageOverlays.slice(overlayIndex + 1)
            ];
          }
        });
        
        if (!overlay || oldPageIndex === null) return state;
        
        // Add to new page
        if (!newOverlays[newPageIndex]) {
          newOverlays[newPageIndex] = [];
        }
        
        // Create new overlay with updated page index
        const newOverlay = Object.assign({}, overlay, { pageIndex: newPageIndex });
        
        newOverlays[newPageIndex].push(newOverlay);
        
        const newDocument = {
          ...state.document,
          overlays: newOverlays,
          modifiedAt: Date.now(),
        };
        
        return { document: newDocument };
      }),
      
      updateFormField: (name, value) => set((state) => {
        if (!state.document) return state;
        
        const newForms = state.document.forms.map(field => 
          field.name === name ? { ...field, value } : field
        );
        
        const newDocument = {
          ...state.document,
          forms: newForms,
          modifiedAt: Date.now(),
        };
        
        return { document: newDocument };
      }),
      
      rotatePage: (pageIndex, rotation) => set((state) => {
        if (!state.document) return state;
        
        const newPages = state.document.pages.map((page, index) =>
          index === pageIndex ? { ...page, rotation } : page
        );
        
        const newDocument = {
          ...state.document,
          pages: newPages,
          modifiedAt: Date.now(),
        };
        
        return { document: newDocument };
      }),
      
      deletePage: (pageIndex) => set((state) => {
        if (!state.document) return state;
        
        const newPages = state.document.pages.filter((_, index) => index !== pageIndex);
        const newOverlays = { ...state.document.overlays };
        
        // Remove overlays from deleted page and shift others down
        delete newOverlays[pageIndex];
        Object.keys(newOverlays).forEach((key) => {
          const pageIndexNum = parseInt(key);
          if (pageIndexNum > pageIndex) {
            newOverlays[pageIndexNum - 1] = newOverlays[pageIndexNum];
            delete newOverlays[pageIndexNum];
          }
        });
        
        const newDocument = {
          ...state.document,
          pages: newPages,
          pageCount: newPages.length,
          overlays: newOverlays,
          modifiedAt: Date.now(),
        };
        
        return { document: newDocument };
      }),
      
      insertPage: (pageIndex, page) => set((state) => {
        if (!state.document) return state;
        
        const newPages = [...state.document.pages];
        newPages.splice(pageIndex, 0, page);
        
        // Shift overlays for pages after insertion
        const newOverlays = { ...state.document.overlays };
        Object.keys(newOverlays).forEach((key) => {
          const pageIndexNum = parseInt(key);
          if (pageIndexNum >= pageIndex) {
            newOverlays[pageIndexNum + 1] = newOverlays[pageIndexNum];
            delete newOverlays[pageIndexNum];
          }
        });
        
        const newDocument = {
          ...state.document,
          pages: newPages,
          pageCount: newPages.length,
          overlays: newOverlays,
          modifiedAt: Date.now(),
        };
        
        return { document: newDocument };
      }),
      
      reorderPages: (newOrder) => set((state) => {
        if (!state.document) return state;
        
        const newPages = newOrder.map(index => state.document!.pages[index]);
        const newOverlays: Record<number, Overlay[]> = {};
        
        // Reorder overlays according to new page order
        newOrder.forEach((oldIndex, newIndex) => {
          if (state.document!.overlays[oldIndex]) {
            newOverlays[newIndex] = state.document!.overlays[oldIndex].map((overlay: Overlay) => ({
              ...overlay,
              pageIndex: newIndex
            }));
          }
        });
        
        const newDocument = {
          ...state.document,
          pages: newPages,
          overlays: newOverlays,
          modifiedAt: Date.now(),
        };
        
        return { document: newDocument };
      }),
      
      saveToHistory: () => set((state) => {
        if (!state.document) return state;
        
        const newHistory = [...state.history.slice(0, state.historyIndex + 1), state.document];
        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift();
        }
        
        return {
          history: newHistory,
          historyIndex: newHistory.length - 1,
          canUndo: newHistory.length > 1,
          canRedo: false,
        };
      }),
      
      undo: () => set((state) => {
        if (state.historyIndex <= 0) return state;
        
        const newIndex = state.historyIndex - 1;
        const newDocument = state.history[newIndex];
        
        return {
          document: newDocument,
          historyIndex: newIndex,
          canUndo: newIndex > 0,
          canRedo: true,
        };
      }),
      
      redo: () => set((state) => {
        if (state.historyIndex >= state.history.length - 1) return state;
        
        const newIndex = state.historyIndex + 1;
        const newDocument = state.history[newIndex];
        
        return {
          document: newDocument,
          historyIndex: newIndex,
          canUndo: true,
          canRedo: newIndex < state.history.length - 1,
        };
      }),
    }),
    {
      name: 'privatepdf-store',
    }
  )
);