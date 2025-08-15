const replUrl = "https://33243b64-65f9-4988-8d60-13ca62670193-00-3oapw4fw99k9c.picard.replit.dev/";

const iframe = document.getElementById('app-frame');
const container = document.getElementById('iframe-container');
const videoH = document.getElementById('video-horizontal');
const videoV = document.getElementById('video-vertical');
const videoContainer = document.querySelector('.video-container');

function updateVideoDisplay() {
    if (window.innerHeight > window.innerWidth) {
        videoV.style.display = 'block';
        videoH.style.display = 'none';
    } else {
        videoH.style.display = 'block';
        videoV.style.display = 'none';
    }
}

updateVideoDisplay();
window.addEventListener('resize', updateVideoDisplay);
window.addEventListener('orientationchange', updateVideoDisplay);

function showIframe() {
    // Fade-out videos
    videoContainer.style.opacity = '0';

    // Esperar la transición antes de ocultar completamente
    setTimeout(() => {
        videoH.style.display = 'none';
        videoV.style.display = 'none';
        videoContainer.style.display = 'none';

        // Mostrar iframe con fade-in
        container.classList.add('active');

        if (replUrl) {
            iframe.src = replUrl;
        } else {
            iframe.srcdoc = "<p>La aplicación no está disponible.</p>";
            console.warn("⚠️ La URL de Replit no está configurada.");
        }
    }, 1000); // duración de transición
}

// Detectar final de video o timeout
videoH.addEventListener('ended', showIframe);
videoV.addEventListener('ended', showIframe);

// Timeout opcional: mostrar iframe tras 8s
setTimeout(showIframe, 8000);