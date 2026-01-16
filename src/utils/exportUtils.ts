import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Enhanced wait function with DOM ready check
 */
const waitForExportReady = async (): Promise<void> => {
  // Wait for DOM to be fully ready
  if (document.readyState !== 'complete') {
    await new Promise(resolve => window.addEventListener('load', resolve));
  }
  
  // Wait for animations and rendering
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Force synchronous reflow
  document.body.offsetHeight;
};

/**
 * Store and hide interfering elements
 */
const hideInterferingElements = (): Array<{element: Element, originalStyle: string}> => {
  const elementsToHide = document.querySelectorAll([
    '.fixed',
    '.absolute',
    '.floating',
    '.modal',
    '.dropdown',
    '.tooltip',
    '.popover',
    '.notification',
    '.toast',
    '[data-export-ignore="true"]'
  ].join(','));

  const originalStyles: Array<{element: Element, originalStyle: string}> = [];

  elementsToHide.forEach((el) => {
    const htmlEl = el as HTMLElement;
    originalStyles.push({
      element: el,
      originalStyle: htmlEl.style.cssText
    });
    
    htmlEl.style.cssText += `
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    `;
  });

  return originalStyles;
};

/**
 * Restore hidden elements
 */
const restoreElements = (originalStyles: Array<{element: Element, originalStyle: string}>): void => {
  originalStyles.forEach(({element, originalStyle}) => {
    (element as HTMLElement).style.cssText = originalStyle;
  });
};

/**
 * Apply export-specific styles to ensure proper rendering
 */
const applyExportStyles = (element: HTMLElement): void => {
  element.classList.add('exporting-active');
  
  // Force styles for reliable rendering
  const style = document.createElement('style');
  style.id = 'export-styles';
  style.textContent = `
    .exporting-active {
      opacity: 1 !important;
      visibility: visible !important;
      display: block !important;
      position: relative !important;
      transform: none !important;
      overflow: visible !important;
    }
    
    .exporting-active * {
      box-sizing: border-box !important;
      transform: translateZ(0) !important;
      opacity: 1 !important;
      visibility: visible !important;
    }
    
    .exporting-active canvas,
    .exporting-active svg,
    .exporting-active img {
      display: inline-block !important;
      visibility: visible !important;
    }
  `;
  document.head.appendChild(style);
};

/**
 * Remove export styles
 */
const removeExportStyles = (element: HTMLElement): void => {
  element.classList.remove('exporting-active');
  const exportStyles = document.getElementById('export-styles');
  if (exportStyles) {
    exportStyles.remove();
  }
};

/**
 * Enhanced HTML2Canvas configuration
 */
const getHtml2CanvasConfig = (element: HTMLElement) => ({
  backgroundColor: '#ffffff',
  scale: 2,
  logging: true, // Enable for debugging
  useCORS: true,
  allowTaint: false,
  removeContainer: true,
  width: element.scrollWidth,
  height: element.scrollHeight,
  scrollX: 0,
  scrollY: 0,
  x: 0,
  y: 0,
  foreignObjectRendering: false,
  imageTimeout: 15000,
  onclone: (clonedDoc: Document, clonedElement: HTMLElement) => {
    // Ensure all fonts are loaded
    clonedDoc.fonts.ready.then(() => {
      console.log('Fonts loaded for export');
    });
    
    // Apply styles to cloned element
    clonedElement.style.cssText = `
      opacity: 1 !important;
      visibility: visible !important;
      display: block !important;
      position: relative !important;
      transform: none !important;
      overflow: visible !important;
      width: ${element.scrollWidth}px !important;
      height: ${element.scrollHeight}px !important;
    `;
    
    // Force render all child elements
    const allElements = clonedElement.querySelectorAll('*');
    allElements.forEach((el: Element) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.cssText += `
        transform: translateZ(0) !important;
        opacity: 1 !important;
        visibility: visible !important;
      `;
    });
    
    // Ensure images are loaded
    const images = clonedElement.querySelectorAll('img');
    images.forEach((img: HTMLImageElement) => {
      if (!img.complete) {
        img.addEventListener('load', () => {
          console.log('Image loaded in clone');
        });
      }
    });
  }
});

/**
 * Download blob as file
 */
const downloadBlob = (blob: Blob, filename: string, extension: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.${extension}`;
  link.href = url;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up URL
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/**
 * Export dashboard as PNG image
 */
export const exportAsImage = async (elementId: string, filename: string = 'dashboard'): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found`);
    alert('Export element not found. Please check the element ID.');
    return;
  }

  // Show loading state
  const originalCursor = document.body.style.cursor;
  document.body.style.cursor = 'wait';

  try {
    console.log('Starting PNG export...');
    
    // Wait for everything to be ready
    await waitForExportReady();
    
    // Hide interfering elements
    const originalStyles = hideInterferingElements();
    
    // Apply export styles
    applyExportStyles(element);
    
    // Force a reflow
    element.offsetHeight;
    
    // Create canvas
    console.log('Creating canvas...');
    const canvas = await html2canvas(element, getHtml2CanvasConfig(element));
    console.log('Canvas created successfully');
    
    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        downloadBlob(blob, filename, 'png');
        console.log('PNG export completed successfully');
      } else {
        throw new Error('Failed to create PNG blob from canvas');
      }
    }, 'image/png', 1.0);

  } catch (error) {
    console.error('PNG Export error:', error);
    alert(`Failed to export as PNG: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    // Restore everything
    const element = document.getElementById(elementId);
    if (element) {
      removeExportStyles(element);
    }
    
    const originalStyles = hideInterferingElements();
    restoreElements(originalStyles);
    
    document.body.style.cursor = originalCursor;
  }
};

/**
 * Export dashboard as PDF
 */
export const exportAsPDF = async (elementId: string, filename: string = 'dashboard'): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found`);
    alert('Export element not found. Please check the element ID.');
    return;
  }

  // Show loading state
  const originalCursor = document.body.style.cursor;
  document.body.style.cursor = 'wait';

  try {
    console.log('Starting PDF export...');
    
    // Wait for everything to be ready
    await waitForExportReady();
    
    // Hide interfering elements
    const originalStyles = hideInterferingElements();
    
    // Apply export styles
    applyExportStyles(element);
    
    // Force a reflow
    element.offsetHeight;
    
    // Create canvas
    console.log('Creating canvas for PDF...');
    const canvas = await html2canvas(element, {
      ...getHtml2CanvasConfig(element),
      backgroundColor: '#ffffff' // White background for PDF
    });
    console.log('Canvas for PDF created successfully');
    
    // Calculate PDF dimensions
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // Convert pixels to mm (1px = 0.264583mm at 96dpi)
    const pdfWidth = imgWidth * 0.264583;
    const pdfHeight = imgHeight * 0.264583;
    
    console.log(`PDF dimensions: ${pdfWidth}x${pdfHeight}mm`);
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [pdfWidth, pdfHeight],
      compress: true
    });
    
    // Add image to PDF
    const imgData = canvas.toDataURL('image/png', 1.0);
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    
    // Save PDF
    pdf.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`);
    console.log('PDF export completed successfully');
    
  } catch (error) {
    console.error('PDF Export error:', error);
    alert(`Failed to export as PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    // Restore everything
    const element = document.getElementById(elementId);
    if (element) {
      removeExportStyles(element);
    }
    
    const originalStyles = hideInterferingElements();
    restoreElements(originalStyles);
    
    document.body.style.cursor = originalCursor;
  }
};

/**
 * Export using React ref (alternative method)
 */
export const exportWithRef = async (
  elementRef: React.RefObject<HTMLElement>,
  format: 'png' | 'pdf' = 'png',
  filename: string = 'dashboard'
): Promise<void> => {
  if (!elementRef.current) {
    console.error('Element ref is not available');
    return;
  }
  
  // Create a temporary ID for the element
  const tempId = `export-element-${Date.now()}`;
  elementRef.current.id = tempId;
  
  try {
    if (format === 'png') {
      await exportAsImage(tempId, filename);
    } else {
      await exportAsPDF(tempId, filename);
    }
  } finally {
    // Clean up temporary ID
    if (elementRef.current) {
      elementRef.current.removeAttribute('id');
    }
  }
};

/**
 * Batch export multiple formats
 */
export const exportMultipleFormats = async (
  elementId: string,
  formats: ('png' | 'pdf')[] = ['png', 'pdf'],
  filename: string = 'dashboard'
): Promise<void> => {
  for (const format of formats) {
    try {
      if (format === 'png') {
        await exportAsImage(elementId, filename);
      } else if (format === 'pdf') {
        await exportAsPDF(elementId, filename);
      }
      
      // Small delay between exports
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed to export as ${format.toUpperCase()}:`, error);
      // Continue with next format even if one fails
    }
  }
};

export default {
  exportAsImage,
  exportAsPDF,
  exportWithRef,
  exportMultipleFormats
};