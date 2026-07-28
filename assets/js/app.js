import { CONFIG } from './config.js';
import { DOM } from './ui/dom.elements.js';
import { ToastUI } from './ui/toast.ui.js';
import { ThemeUI } from './ui/theme.controller.js';
import { StatsUI } from './ui/stats.ui.js';
import { OllamaService } from './services/ollama.service.js';
import { PdfService } from './services/pdf.service.js';

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  registerEvents();
});

function initApp() {
  ThemeUI.init();
  DOM.appVersionTag.textContent = CONFIG.VERSION;
  runHealthCheck();
}

/**
 * Healthcheck de Ollama
 */
async function runHealthCheck() {
  const isOnline = await OllamaService.checkHealth();
  if (isOnline) {
    DOM.healthBadge.className = 'status-badge online';
    DOM.healthDot.textContent = '🟢';
    DOM.healthText.textContent = `Conectado a Ollama (${CONFIG.OLLAMA.MODEL})`;
  } else {
    DOM.healthBadge.className = 'status-badge offline';
    DOM.healthDot.textContent = '🔴';
    DOM.healthText.textContent = 'Ollama Desconectado';
  }
}

// ==========================================
// FLUJO Y DESACOPLO DE RESPONSABILIDADES
// ==========================================

function obtenerFormulario() {
  return {
    texto: DOM.userEmailInput.value.trim(),
    estilo: DOM.toneSelect ? DOM.toneSelect.value : 'profesional'
  };
}

function validar(datos) {
  if (!datos.texto) {
    ToastUI.show('Por favor, escribe o pega un texto borrador.', true);
    return false;
  }
  return true;
}

function actualizarEstadoCarga(cargando) {
  DOM.transformBtn.disabled = cargando;
  if (cargando) {
    DOM.btnText.textContent = "Pensando...";
    DOM.btnSpinner.classList.remove('hidden');
    DOM.copyBtn.disabled = true;
    DOM.downloadPdfBtn.disabled = true;
  } else {
    DOM.btnText.textContent = "🦙 Transformar con IA Local";
    DOM.btnSpinner.classList.add('hidden');
  }
}

function actualizarVista(textoResultado, tiempoMs) {
  DOM.resultContent.textContent = textoResultado;
  DOM.resultContent.classList.remove('placeholder');
  
  DOM.resultContent.classList.remove('fade-in');
  void DOM.resultContent.offsetWidth;
  DOM.resultContent.classList.add('fade-in');

  DOM.copyBtn.disabled = false;
  DOM.downloadPdfBtn.disabled = false;

  // Renderizar métricas
  StatsUI.render(textoResultado, tiempoMs);
}

// ==========================================
// ACCIONES
// ==========================================

async function handleTransform() {
  const datos = obtenerFormulario();
  if (!validar(datos)) return;

  actualizarEstadoCarga(true);
  const inicioTiempo = performance.now();

  try {
    const textoMejorado = await OllamaService.generateText(datos.texto, datos.estilo);
    const finTiempo = performance.now();
    
    actualizarVista(textoMejorado, finTiempo - inicioTiempo);
    ToastUI.show(`¡Correo transformado en modo ${datos.estilo}!`);
  } catch (error) {
    console.error(error);
    ToastUI.show('No se pudo procesar la solicitud con Ollama.', true);
  } finally {
    actualizarEstadoCarga(false);
  }
}

async function handlePaste() {
  try {
    const text = await navigator.clipboard.readText();
    DOM.userEmailInput.value = text;
    ToastUI.show('Texto pegado del portapapeles');
  } catch {
    ToastUI.show('No se pudo acceder al portapapeles.', true);
  }
}

async function handleCopy() {
  if (DOM.copyBtn.disabled) return;
  try {
    await navigator.clipboard.writeText(DOM.resultContent.textContent);
    DOM.copyBtn.textContent = '✅ ¡Copiado!';
    setTimeout(() => DOM.copyBtn.textContent = '📄 Copiar', 2000);
    ToastUI.show('Resultado copiado al portapapeles');
  } catch {
    ToastUI.show('Error al copiar el texto.', true);
  }
}

function handleDownloadPdf() {
  if (DOM.downloadPdfBtn.disabled) return;
  try {
    PdfService.exportElement(DOM.pdfArea);
    ToastUI.show('Generando archivo PDF...');
  } catch (err) {
    ToastUI.show(err.message, true);
  }
}

// ==========================================
// REGISTRO DE EVENTOS (Cero duplicación)
// ==========================================
function registerEvents() {
  DOM.transformBtn.addEventListener('click', handleTransform);
  DOM.pasteBtn.addEventListener('click', handlePaste);
  DOM.copyBtn.addEventListener('click', handleCopy);
  DOM.downloadPdfBtn.addEventListener('click', handleDownloadPdf);
}