import { DOM } from './dom.elements.js';

export class ToastUI {
  static show(mensaje, esError = false) {
    const toast = document.createElement('div');
    toast.className = `toast ${esError ? 'error' : ''}`;
    toast.textContent = mensaje;

    DOM.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  }
}