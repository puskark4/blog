import { PDFDocument } from 'pdf-lib';
import type { DocumentState, PageState, FormFieldState, FileInfo } from '../../types';

class FileManager {
  private recentFiles: FileInfo[] = [];
  private readonly MAX_RECENT_FILES = 10;

  constructor() {
    this.loadRecentFiles();
  }

  async openFile(file: File): Promise<DocumentState> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Extract page information
      const pages: PageState[] = [];
      for (let i = 0; i < pdfDoc.getPageCount(); i++) {
        const page = pdfDoc.getPage(i);
        const { width, height } = page.getSize();
        pages.push({
          index: i,
          widthPt: width,
          heightPt: height,
          rotation: 0,
        });
      }

      // Extract form fields
      const forms: FormFieldState[] = [];
      try {
        const form = pdfDoc.getForm();
        const fields = form.getFields();
        
        fields.forEach(field => {
          const fieldType = field.constructor.name.toLowerCase();
          let type: 'text' | 'checkbox' | 'radio' | 'dropdown' = 'text';
          
          if (fieldType.includes('checkbox')) type = 'checkbox';
          else if (fieldType.includes('radio')) type = 'radio';
          else if (fieldType.includes('dropdown')) type = 'dropdown';
          
          // Try to get page index safely
          let pageIndex = 0;
          try {
            const fieldPage = (field as any).getPage?.();
            if (fieldPage && typeof fieldPage.index === 'number') {
              pageIndex = fieldPage.index;
            }
          } catch {
            // Fallback to page 0 if we can't get the page
          }
          
          forms.push({
            name: field.getName(),
            type,
            pageIndex,
            value: undefined,
          });
        });
      } catch (error) {
        console.log('No forms found in PDF or error reading forms:', error);
      }

      const document: DocumentState = {
        id: crypto.randomUUID(),
        name: file.name,
        pageCount: pages.length,
        pages,
        forms,
        overlays: {},
        pdfBytes: arrayBuffer,
        modifiedAt: Date.now(),
      };

      // Add to recent files
      this.addToRecentFiles({
        id: document.id,
        name: file.name,
        size: file.size,
        lastOpened: Date.now(),
      });

      return document;
    } catch (error) {
      console.error('Error opening PDF:', error);
      throw new Error('Failed to open PDF file. Please ensure it is a valid PDF document.');
    }
  }

  async saveFile(
    document: DocumentState, 
    options: { flattenForms: boolean; includeOverlays: boolean }
  ): Promise<Blob> {
    try {
      // Load the original PDF
      const pdfDoc = await PDFDocument.load(document.pdfBytes);
      
      if (options.includeOverlays) {
        // Add overlays to the PDF
        await this.addOverlaysToPDF(pdfDoc, document);
      }

      if (options.flattenForms) {
        // Flatten forms
        try {
          const form = pdfDoc.getForm();
          form.flatten();
        } catch (error) {
          console.log('No forms to flatten or error flattening forms:', error);
        }
      } else {
        // Update form field appearances
        try {
          const form = pdfDoc.getForm();
          const fields = form.getFields();
          
          fields.forEach(field => {
            const formField = document.forms.find(f => f.name === field.getName());
            if (formField && formField.value !== undefined) {
              if (field.constructor.name.toLowerCase().includes('checkbox')) {
                (field as any).check(formField.value as boolean);
              } else if (field.constructor.name.toLowerCase().includes('radio')) {
                (field as any).select(formField.value as string);
              } else if (field.constructor.name.toLowerCase().includes('dropdown')) {
                (field as any).select(formField.value as string);
              } else {
                (field as any).setText(formField.value as string);
              }
            }
          });
          
          // Update field appearances
          form.updateFieldAppearances();
        } catch (error) {
          console.log('Error updating form fields:', error);
        }
      }

      // Save the modified PDF
      const pdfBytes = await pdfDoc.save();
      return new Blob([pdfBytes], { type: 'application/pdf' });
    } catch (error) {
      console.error('Error saving PDF:', error);
      throw new Error('Failed to save PDF file.');
    }
  }

  private async addOverlaysToPDF(pdfDoc: PDFDocument, document: DocumentState): Promise<void> {
    // This is a placeholder for the overlay rendering logic
    // In a full implementation, you would:
    // 1. For each page with overlays
    // 2. Convert overlays from PDF coordinates to the page's coordinate system
    // 3. Draw them using pdf-lib's drawing methods
    
    Object.entries(document.overlays).forEach(([pageIndexStr, overlays]) => {
      const pageIndex = parseInt(pageIndexStr);
      if (pageIndex < pdfDoc.getPageCount()) {
        // const page = pdfDoc.getPage(pageIndex);
        
        overlays.forEach(overlay => {
          switch (overlay.kind) {
            case 'text':
              // page.drawText(overlay.text, { x: overlay.x, y: overlay.y, size: overlay.fontSize });
              break;
            case 'rect':
              // page.drawRectangle({ x: overlay.x, y: overlay.y, width: overlay.w, height: overlay.h });
              break;
            // Add other overlay types...
          }
        });
      }
    });
  }

  async saveToFileSystem(blob: Blob, suggestedName: string): Promise<void> {
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName,
          types: [{
            description: 'PDF Document',
            accept: { 'application/pdf': ['.pdf'] },
          }],
        });
        
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Error saving to file system:', error);
          throw error;
        }
      }
    } else {
      // Fallback to download
      this.downloadBlob(blob, suggestedName);
    }
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private addToRecentFiles(fileInfo: FileInfo): void {
    // Remove if already exists
    this.recentFiles = this.recentFiles.filter(f => f.id !== fileInfo.id);
    
    // Add to beginning
    this.recentFiles.unshift(fileInfo);
    
    // Keep only the most recent files
    if (this.recentFiles.length > this.MAX_RECENT_FILES) {
      this.recentFiles = this.recentFiles.slice(0, this.MAX_RECENT_FILES);
    }
    
    this.saveRecentFiles();
  }

  private saveRecentFiles(): void {
    try {
      localStorage.setItem('privatepdf-recent-files', JSON.stringify(this.recentFiles));
    } catch (error) {
      console.error('Error saving recent files:', error);
    }
  }

  private loadRecentFiles(): void {
    try {
      const stored = localStorage.getItem('privatepdf-recent-files');
      if (stored) {
        this.recentFiles = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading recent files:', error);
      this.recentFiles = [];
    }
  }

  getRecentFiles(): FileInfo[] {
    return [...this.recentFiles];
  }

  clearRecentFiles(): void {
    this.recentFiles = [];
    this.saveRecentFiles();
  }

  async openRecentFile(fileId: string): Promise<DocumentState | null> {
    // In a real implementation, you might store the file data in IndexedDB
    // For now, we'll just return null and require the user to select the file again
    console.log('Opening recent file:', fileId);
    return null;
  }
}

export const fileManager = new FileManager();
export default fileManager;