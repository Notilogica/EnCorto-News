// URL simulada de Replit (secreta)
const replUrl = "https://33243b64-65f9-4988-8d60-13ca62670193-00-3oapw4fw99k9c.picard.replit.dev/";
const iframe = document.getElementById('app-frame');
const videoH = document.getElementById('video-horizontal');
const videoV = document.getElementById('video-vertical');
const videoContainer = document.querySelector('.video-container');
const iframeContainer = document.getElementById('iframe-container');

// Función para mostrar el video correcto según orientación
function updateVideoDisplay() {
    const isPortrait = window.innerHeight > window.innerWidth;
    videoH.style.display = isPortrait ? 'none' : 'block';
    videoV.style.display = isPortrait ? 'block' : 'none';
}

// Inicializa la URL del iframe
function loadIframe() {
    if (replUrl) {
        iframe.src = replUrl;
    } else {
        iframe.srcdoc = "<p>La aplicación no está disponible.</p>";
        console.warn("⚠️ La URL de Replit no está configurada.");
    }
}

// Al finalizar cualquier video, fade-out y mostrar iframe
function setupVideoEndListeners() {
    [videoH, videoV].forEach(video => {
        video.addEventListener('ended', () => {
            videoContainer.style.display = 'none';
            iframeContainer.style.opacity = 1;
        });
    });
}

// Detecta cambios de orientación o resize
window.addEventListener('resize', updateVideoDisplay);
window.addEventListener('orientationchange', updateVideoDisplay);

// Ejecutar al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    updateVideoDisplay();
    loadIframe();
    setupVideoEndListeners();
});