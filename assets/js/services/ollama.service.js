import { CONFIG, PROMPTS } from '../config.js';

export class OllamaService {
  /**
   * Health Check: Comprueba si Ollama responde en segundo plano
   */
  static async checkHealth() {
    try {
      const response = await fetch(CONFIG.OLLAMA.TAGS_ENDPOINT, { method: 'GET' });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Envía la petición de generación a Ollama
   */
  static async generateText(promptTexto, estilo = 'profesional') {
    const sistemaPrompt = PROMPTS[estilo] || PROMPTS.profesional;

    const payload = {
      model: CONFIG.OLLAMA.MODEL,
      prompt: `${sistemaPrompt}\n\nTexto a corregir:\n"${promptTexto}"`,
      stream: false
    };

    const response = await fetch(CONFIG.OLLAMA.GENERATE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Respuesta fallida del servidor Ollama');
    }

    const data = await response.json();
    return data.response.trim();
  }
}