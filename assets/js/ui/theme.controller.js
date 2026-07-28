import { DOM } from './dom.elements.js';

export class ThemeUI {
  static init() {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) this.enableDark();

    DOM.themeToggleBtn.addEventListener('click', () => this.toggle());
  }

  static toggle() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    this.updateIcon(isDark);
  }

  static enableDark() {
    document.body.classList.add('dark-theme');
    this.updateIcon(true);
  }

  static updateIcon(isDark) {
    DOM.themeIcon.textContent = isDark ? '☀️' : '🌙';
    DOM.themeText.textContent = isDark ? 'Modo Claro' : 'Modo Oscuro';
  }
}