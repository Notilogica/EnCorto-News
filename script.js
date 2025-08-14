// Elementos principales
const appFrame = document.getElementById('app-frame');
const videoHorizontal = document.getElementById('video-horizontal');
const videoVertical = document.getElementById('video-vertical');
const videoContainer = document.querySelector('.video-container');

// Función para detectar la orientación actual del dispositivo
function detectOrientation() {
  return window.innerWidth > window.innerHeight ? 'horizontal' : 'vertical';
}

// Función para mostrar el video correspondiente según orientación
function showIntroVideo() {
  const orientation = detectOrientation();

  if (orientation === 'horizontal') {
    videoHorizontal.style.display = 'block';
    videoVertical.style.display = 'none';
    return videoHorizontal;
  } else {
    videoVertical.style.display = 'block';
    videoHorizontal.style.display = 'none';
    return videoVertical;
  }
}

// Función para cargar la URL del backend de manera segura
async function loadAppUrl() {
  try {
    // Se recomienda que este endpoint devuelva JSON: { "url": "https://tu-backend.repl.co" }
    const response = await fetch('https://33243b64-65f9-4988-8d60-13ca62670193-00-3oapw4fw99k9c.picard.replit.dev/api/app-url');
    const data = await response.json();

    if (data.url) {
      appFrame.src = data.url;
    } else {
      console.error('No se recibió URL válida del backend');
    }
  } catch (error) {
    console.error('Error al obtener URL del backend:', error);
  }
}

// Función principal de inicialización
function init() {
  // Mostrar el video inicial
  const currentVideo = showIntroVideo();

  // Cuando el video termina (en caso de no loop), mostrar iframe
  currentVideo.addEventListener('ended', () => {
    videoContainer.style.display = 'none';
    appFrame.style.display = 'block';
  });

  // En dispositivos móviles con loop activado, podemos cambiar automáticamente si rotan
  window.addEventListener('resize', () => {
    showIntroVideo();
  });

  // Cargar la URL del backend
  loadAppUrl();
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);