import { CONFIG } from '../config.js';

export class PdfService {
  static exportElement(element) {
    if (typeof html2pdf === 'undefined') {
      throw new Error('Librería html2pdf no disponible');
    }

    html2pdf().set({
      margin: CONFIG.PDF.MARGIN,
      filename: CONFIG.PDF.FILENAME,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(element).save();
  }
}