// ==========================================
// 1. REFERENCIAS AL DOM
// ==========================================
const DOM = {
  userEmailInput: document.getElementById('userEmail'),
  toneSelect: document.getElementById('toneSelect'), // <-- Corregido: Añadida la referencia
  transformBtn: document.getElementById('transformBtn'),
  btnText: document.getElementById('btnText'),
  btnSpinner: document.getElementById('btnSpinner'),
  resultContent: document.getElementById('resultContent'),
  pdfArea: document.getElementById('pdfArea'),
  pasteBtn: document.getElementById('pasteBtn'),
  copyBtn: document.getElementById('copyBtn'),
  downloadPdfBtn: document.getElementById('downloadPdfBtn'),
  toastContainer: document.getElementById('toastContainer'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  themeIcon: document.getElementById('themeIcon'),
  themeText: document.getElementById('themeText'),
};

/**
 * Alterna entre Modo Claro y Modo Oscuro
 */
function alternarTema() {
  const esOscuro = document.body.classList.toggle('dark-mode');

  // Actualizar icono y texto del botón
  if (esOscuro) {
    DOM.themeIcon.textContent = '☀️';
    DOM.themeText.textContent = 'Modo Claro';
    localStorage.setItem('theme', 'dark');
  } else {
    DOM.themeIcon.textContent = '🌙';
    DOM.themeText.textContent = 'Modo Oscuro';
    localStorage.setItem('theme', 'light');
  }
}

/**
 * Carga la preferencia de tema guardada previamente
 */
function cargarTemaGuardado() {
  const temaGuardado = localStorage.getItem('theme');
  if (temaGuardado === 'dark') {
    document.body.classList.add('dark-mode');
    DOM.themeIcon.textContent = '☀️';
    DOM.themeText.textContent = 'Modo Claro';
  }
}
// Configuración de la API Local (Corregido el nombre a OLLAMA_CONFIG)
const OLLAMA_CONFIG = {
  url: 'http://localhost:11434/api/generate',
  model: 'llama3.2'
};

// ==========================================
// 2. CONFIGURACIÓN DE PROMPTS Y ESTILOS
// ==========================================
const PROMPTS = {
  profesional: `Eres un redactor ejecutivo senior. Tu único objetivo es corregir las faltas de ortografía, reestructurar la redacción y mejorar el vocabulario del texto proporcionado para convertirlo en un correo electrónico profesional, cordial y elegante. Devuelve ÚNICAMENTE el texto del correo listo para enviar, sin notas adicionales.`,

  casual: `Eres un redactor cercano y amigable. Reescribe el texto para que sea un correo fresco, relajado y natural, ideal para compañeros de trabajo cercanos o conocidos, pero sin faltas de ortografía ni palabras vulgares. Devuelve ÚNICAMENTE el texto listo para enviar.`,

  comercial: `Eres un experto en ventas y copywriting. Transforma el borrador en un correo persuasivo, enfocado en destacar el valor del mensaje, con una llamada a la acción clara y un tono sumamente atractivo para un cliente. Devuelve ÚNICAMENTE el texto listo para enviar.`,

  legal: `Eres un consultor jurídico. Reescribe el texto utilizando un lenguaje formal, preciso, riguroso e impecable, apto para comunicaciones oficiales, contratos o requerimientos formales. Devuelve ÚNICAMENTE el texto listo para enviar.`,

  academico: `Eres un profesor e investigador universitario. Adapta el texto para que tenga un tono formal, analítico y riguroso, ideal para comunicarte con facultades, departamentos académicos o revistas científicas. Devuelve ÚNICAMENTE el texto listo para enviar.`,

  soporte: `Eres un agente de soporte técnico experto. Reescribe el texto para que sea claro, directo, estructurado por pasos si es necesario, muy empático y enfocado en resolver dudas o incidencias de un usuario. Devuelve ÚNICAMENTE el texto listo para enviar.`
};

// ==========================================
// 3. FUNCIONES AUXILIARES Y UI
// ==========================================

/**
 * Muestra un mensaje visual Toast reemplazando el alert()
 */
function mostrarNotificacion(mensaje, esError = false) {
  const toast = document.createElement('div');
  toast.className = `toast ${esError ? 'error' : ''}`;
  toast.textContent = mensaje;

  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3500);
}

/**
 * Actualiza el estado visual durante la carga (Spinner / Botones)
 */
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

/**
 * Muestra el resultado final aplicando animación Fade In
 */
function mostrarResultado(texto) {
  DOM.resultContent.textContent = texto;
  DOM.resultContent.classList.remove('placeholder');
  
  // Animación CSS Fade In
  DOM.resultContent.classList.remove('fade-in');
  void DOM.resultContent.offsetWidth; // Force Reflow para reiniciar animación
  DOM.resultContent.classList.add('fade-in');

  DOM.copyBtn.disabled = false;
  DOM.downloadPdfBtn.disabled = false;
}

// ==========================================
// 4. CAPA DE SERVICIO / COMUNICACIÓN CON IA
// ==========================================

/**
 * Llama a la API local de Ollama utilizando el prompt seleccionado
 */
async function llamarOllama(promptTexto, estilo = 'profesional') {
  const sistemaPrompt = PROMPTS[estilo] || PROMPTS.profesional;

  const payload = {
    model: OLLAMA_CONFIG.model,
    prompt: `${sistemaPrompt}\n\nTexto a corregir:\n"${promptTexto}"`,
    stream: false
  };

  const response = await fetch(OLLAMA_CONFIG.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Error en la respuesta del servidor Ollama.');
  }

  const data = await response.json();
  return data.response.trim();
}

// ==========================================
// 5. LÓGICA PRINCIPAL DEL NEGOCIO (Acciones)
// ==========================================

/**
 * Función principal coordinadora (Orquestador)
 */
async function transformEmail() {
  const textoEntrada = DOM.userEmailInput.value.trim();
  const estiloSeleccionado = DOM.toneSelect ? DOM.toneSelect.value : 'profesional';

  if (!textoEntrada) {
    mostrarNotificacion('Por favor, escribe o pega un texto borrador.', true);
    return;
  }

  actualizarEstadoCarga(true);

  try {
    const textoMejorado = await llamarOllama(textoEntrada, estiloSeleccionado);
    mostrarResultado(textoMejorado);
    mostrarNotificacion(`¡Correo transformado con éxito en tono ${estiloSeleccionado}!`);
  } catch (error) {
    console.error(error);
    mostrarNotificacion('No se pudo conectar con Ollama. Comprueba que está iniciado.', true);
  } finally {
    actualizarEstadoCarga(false);
  }
}

/**
 * Función para pegar texto desde el portapapeles
 */
async function pegarTexto() {
  try {
    const text = await navigator.clipboard.readText();
    DOM.userEmailInput.value = text;
    mostrarNotificacion('Texto pegado del portapapeles');
  } catch (err) {
    mostrarNotificacion('No se pudo acceder al portapapeles.', true);
  }
}

/**
 * Función para copiar resultado al portapapeles
 */
async function copiarResultado() {
  if (DOM.copyBtn.disabled) return;
  
  try {
    await navigator.clipboard.writeText(DOM.resultContent.textContent);
    
    DOM.copyBtn.textContent = '✅ ¡Copiado!';
    setTimeout(() => DOM.copyBtn.textContent = '📄 Copiar', 2000);
    mostrarNotificacion('Resultado copiado al portapapeles');
  } catch (err) {
    mostrarNotificacion('Error al copiar el texto.', true);
  }
}

/**
 * Función para descargar resultado en PDF
 */
function descargarPDF() {
  if (DOM.downloadPdfBtn.disabled) return;
  
  const element = DOM.pdfArea;
  
  html2pdf().set({
    margin: 15,
    filename: 'Correo-Profesional-IA.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).from(element).save();

  mostrarNotificacion('Generando archivo PDF...');
}

// ==========================================
// 6. EVENT LISTENERS
// ==========================================
DOM.transformBtn.addEventListener('click', transformEmail);
DOM.pasteBtn.addEventListener('click', pegarTexto);
DOM.copyBtn.addEventListener('click', copiarResultado);
DOM.downloadPdfBtn.addEventListener('click', descargarPDF);
// ==========================================
// INICIALIZACIÓN Y EVENT LISTENERS
// ==========================================
cargarTemaGuardado(); // Carga la preferencia al iniciar

DOM.themeToggleBtn.addEventListener('click', alternarTema);
DOM.transformBtn.addEventListener('click', transformEmail);
DOM.pasteBtn.addEventListener('click', pegarTexto);
DOM.copyBtn.addEventListener('click', copiarResultado);
DOM.downloadPdfBtn.addEventListener('click', descargarPDF);