# 📰 Sitio de Noticias Curadas (Frontend)

Este repositorio contiene el código fuente del frontend para un sitio web de noticias curadas.

---

### 🚀 Arquitectura del Proyecto

El proyecto sigue un modelo de arquitectura de microfrontends y backend. Esta separación permite que cada servicio se especialice en una tarea y funcione de manera más eficiente.

- **Backend (API):** Alojado en **Replit**, este componente se encarga de todo el trabajo pesado.
  - Genera y actualiza noticias automáticamente.
  - Se conecta a APIs externas (SerpAPI, Amazon).
  - Almacena los datos de las noticias en archivos JSON y sirve los archivos HTML de los artículos individuales.

- **Frontend (Sitio Estático):** Alojado en **Netlify**, este repositorio se enfoca en la interfaz de usuario.
  - Sirve un `index.html` ligero que carga rápidamente.
  - Usa JavaScript para hacer llamadas a la API del backend en Replit.
  - Construye dinámicamente el contenido de la página principal con los datos recibidos.

---

### ⚙️ Configuración y Despliegue

Este repositorio está diseñado para ser desplegado en **Netlify**. Asegúrate de configurar las redirecciones en el archivo `netlify.toml` para que apunten correctamente a tu URL de Replit.

1.  **Conecta Netlify:** En tu cuenta de Netlify, importa este repositorio de GitHub.
2.  **Configura el archivo `netlify.toml`:** Asegúrate de que las reglas de redirección apunten a la URL de tu proyecto en Replit (ej. `https://tu-proyecto.repl.co`).

Para que el sitio funcione, tu backend en Replit debe estar activo. Usa un servicio como Uptime Robot para mantenerlo despierto 24/7.