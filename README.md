# 📧 Change E-mail AI

> Aplicación web que mejora borradores de correos electrónicos utilizando **IA Local** mediante **Ollama** y el modelo **Llama 3.2**.

El usuario escribe un borrador, la aplicación envía el texto a una instancia local de Ollama mediante una petición HTTP y devuelve una versión corregida y profesional del correo, permitiendo además copiar el resultado o descargarlo en formato PDF.

---

# 🚀 Características

* ✍️ Corrección ortográfica y gramatical mediante IA Local.
* 🧠 Reescritura profesional de correos electrónicos.
* 🔒 Procesamiento completamente local (sin enviar datos a servicios externos).
* 📋 Pegar texto directamente desde el portapapeles.
* 📄 Copiar el resultado al portapapeles.
* 📥 Exportar el correo a PDF.
* 🔄 Indicador de carga mediante spinner.
* 🔔 Sistema de notificaciones visuales (Toast).
* 📱 Diseño responsive.

---

# 🖥️ Capturas

> Próximamente

Puedes añadir aquí imágenes de la aplicación en funcionamiento.

```
/assets/img/screenshot-home.png
/assets/img/screenshot-result.png
```

---

# 🛠️ Tecnologías utilizadas

### Frontend

* HTML5
* CSS3
* JavaScript (ES6+)

### APIs

* Fetch API
* Clipboard API

### Inteligencia Artificial

* Ollama
* Llama 3.2

### Librerías

* html2pdf.js

---

# 📁 Estructura del proyecto

```text
change-email/
│
├── index.html
│
├── assets/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   └── script.js
│   │
│   └── img/
│       └── logo.png
│
└── README.md
```

---

# 🏗️ Arquitectura

La aplicación está organizada separando responsabilidades para facilitar el mantenimiento.

```
Usuario
    │
    ▼
Interfaz (HTML)
    │
    ▼
Eventos
    │
    ▼
Lógica principal
(transformEmail)
    │
    ▼
Servicio
(callOllama)
    │
    ▼
API Local de Ollama
    │
    ▼
Respuesta
    │
    ▼
Actualización de la interfaz
```

---

# ⚙️ Instalación

## 1. Clonar el repositorio

```bash
git clone https://github.com/TU-USUARIO/change-email.git
```

---

## 2. Instalar Ollama

Descarga e instala Ollama desde:

https://ollama.com/

---

## 3. Descargar el modelo

```bash
ollama pull llama3.2
```

---

## 4. Iniciar Ollama

```bash
ollama serve
```

Por defecto la API estará disponible en:

```
http://localhost:11434
```

---

## 5. Ejecutar la aplicación

Abre el archivo `index.html` en tu navegador.

> También puedes utilizar Visual Studio Code con la extensión **Live Server** para una mejor experiencia durante el desarrollo.

---

# 💻 Funcionamiento

1. Escribir o pegar un borrador.
2. Pulsar **Transformar con IA Local**.
3. La aplicación envía una petición HTTP a Ollama.
4. El modelo genera una versión profesional del correo.
5. El usuario puede:

   * Copiar el resultado.
   * Descargarlo en PDF.

---

# 📌 Posibles mejoras

* Selección dinámica del modelo de IA.
* Historial de correos.
* Modos de escritura (Formal, Comercial, Académico, Técnico...).
* Traducción automática.
* Exportación a Word.
* Configuración personalizada de prompts.
* Modo oscuro.
* Soporte para múltiples idiomas.

---

# 📚 Conceptos practicados

Este proyecto me ha permitido practicar:

* Manipulación del DOM.
* Organización del código por responsabilidades.
* Programación asíncrona (`async/await`).
* Consumo de APIs mediante `fetch`.
* Gestión de estados de la interfaz.
* Manejo de errores.
* Refactorización de código.
* Animaciones CSS.
* Experiencia de usuario (UX).

---

# 📄 Licencia

Este proyecto ha sido desarrollado con fines educativos y de aprendizaje como parte de mi formación en **Desarrollo de Aplicaciones Web (DAW)**.

Se permite utilizar el código como referencia indicando la autoría correspondiente.

---

# 👩‍💻 Autor

**Alejandra Begoña Romero Pérez**

Estudiante de Desarrollo de Aplicaciones Web (DAW)

GitHub: https://github.com/TU-USUARIO
