import type { ViewportInfo, PageState, Point, Size } from '../../types';

/**
 * Convert canvas coordinates (0,0 top-left) to PDF points (0,0 bottom-left)
 */
export function canvasToPdf(
  point: Point, 
  page: PageState, 
  viewport: ViewportInfo
): Point {
  const pxToPt = 1 / viewport.scale; // pdf.js px are points * scale
  const pdfX = point.x * pxToPt;
  const pdfY = page.heightPt - (point.y * pxToPt);
  return { x: pdfX, y: pdfY };
}

/**
 * Convert PDF points (0,0 bottom-left) to canvas coordinates (0,0 top-left)
 */
export function pdfToCanvas(
  point: Point, 
  page: PageState, 
  viewport: ViewportInfo
): Point {
  const ptToPx = viewport.scale; // pdf.js px are points * scale
  const canvasX = point.x * ptToPx;
  const canvasY = (page.heightPt - point.y) * ptToPx;
  return { x: canvasX, y: canvasY };
}

/**
 * Convert canvas size to PDF points
 */
export function sizeCanvasToPdf(
  size: Size, 
  viewport: ViewportInfo
): Size {
  const factor = 1 / viewport.scale;
  return { 
    w: size.w * factor, 
    h: size.h * factor 
  };
}

/**
 * Convert PDF points size to canvas pixels
 */
export function sizePdfToCanvas(
  size: Size, 
  viewport: ViewportInfo
): Size {
  const factor = viewport.scale;
  return { 
    w: size.w * factor, 
    h: size.h * factor 
  };
}

/**
 * Get the current viewport information from a pdf.js page view
 */
export function getViewportInfo(
  page: any, // pdf.js page object
  scale: number
): ViewportInfo {
  const viewport = page.getViewport({ scale });
  return {
    scale: viewport.scale,
    widthPx: viewport.width,
    heightPx: viewport.height
  };
}

/**
 * Calculate the center point of a rectangle in PDF coordinates
 */
export function getCenterPoint(
  x: number, 
  y: number, 
  w: number, 
  h: number
): Point {
  return {
    x: x + w / 2,
    y: y + h / 2
  };
}

/**
 * Check if a point is within a rectangle
 */
export function isPointInRect(
  point: Point, 
  rect: { x: number; y: number; w: number; h: number }
): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.w &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.h
  );
}

/**
 * Calculate the distance between two points
 */
export function distanceBetweenPoints(
  p1: Point, 
  p2: Point
): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Snap a point to a grid
 */
export function snapToGrid(
  point: Point, 
  gridSize: number
): Point {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
}