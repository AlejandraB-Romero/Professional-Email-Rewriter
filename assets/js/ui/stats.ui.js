import { DOM } from './dom.elements.js';
import { CONFIG } from '../config.js';

export class StatsUI {
  static render(texto, tiempoMs) {
    const chars = texto.length;
    const words = texto.trim() ? texto.trim().split(/\s+/).length : 0;
    const seconds = (tiempoMs / 1000).toFixed(2);

    DOM.statModel.textContent = CONFIG.OLLAMA.MODEL;
    DOM.statTime.textContent = `${seconds}s`;
    DOM.statChars.textContent = chars;
    DOM.statWords.textContent = words;

    DOM.statsPanel.classList.remove('hidden');
  }
}