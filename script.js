const videoH = document.getElementById('video-horizontal');
const videoV = document.getElementById('video-vertical');
const videoContainer = document.getElementById('videoContainer');
const iframeContainer = document.getElementById('iframe-container');
const iframe = document.getElementById('app-frame');

// URL secreta de Replit (podría cargarse desde ENV)
const REPLIT_URL = window.REPLIT_URL || "https://33243b64-65f9-4988-8d60-13ca62670193-00-3oapw4fw99k9c.picard.replit.dev";

// Detectar orientación y mostrar video correcto
function updateVideoOrientation() {
    if(window.innerHeight > window.innerWidth) {
        videoV.style.display = 'block';
        videoH.style.display = 'none';
        videoV.play();
    } else {
        videoH.style.display = 'block';
        videoV.style.display = 'none';
        videoH.play();
    }
}

// Función para ocultar videos y mostrar iframe
function showIframe() {
    videoContainer.style.transition = 'opacity 0.8s';
    videoContainer.style.opacity = 0;
    setTimeout(() => {
        videoContainer.style.display = 'none';
        iframeContainer.style.display = 'flex';
        iframe.src = REPLIT_URL;

        // Inyectar CSS desde Replit
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const link = iframeDoc.createElement('link');
            link.rel = 'stylesheet';
            link.href = `${REPLIT_URL}/styles.css`;
            iframeDoc.head.appendChild(link);
        } catch (err) {
            console.warn("No se pudo inyectar el CSS en el iframe:", err);
        }
    }, 800);
}

// Configurar eventos
window.addEventListener('load', () => {
    updateVideoOrientation();

    // Escuchar fin de videos
    [videoH, videoV].forEach(video => {
        video.addEventListener('ended', showIframe);
        video.style.display = 'block';
    });
});

// Detectar cambio de orientación
window.addEventListener('resize', updateVideoOrientation);