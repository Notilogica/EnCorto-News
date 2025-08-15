const videoH = document.getElementById('video-horizontal');
const videoV = document.getElementById('video-vertical');
const videoContainer = document.getElementById('videoContainer');
const iframeContainer = document.getElementById('iframe-container');
const iframe = document.getElementById('app-frame');

// URL simulada secreta de Replit
const replUrl = "https://33243b64-65f9-4988-8d60-13ca62670193-00-3oapw4fw99k9c.picard.replit.dev/";

// Mostrar iframe al terminar los videos
function showIframe() {
    videoContainer.style.transition = 'opacity 1s';
    videoContainer.style.opacity = 0;
    setTimeout(() => {
        videoContainer.style.display = 'none';
        iframeContainer.style.display = 'block';
        iframeContainer.style.opacity = 1;
        if (replUrl) {
            iframe.src = replUrl;
        } else {
            iframe.srcdoc = "<p>La aplicación no está disponible.</p>";
            console.warn("⚠️ La URL de Replit no está configurada.");
        }
    }, 1000);
}

// Detectar orientación para mostrar video correcto
function updateVideoOrientation() {
    if(window.innerHeight > window.innerWidth) {
        // Vertical
        videoV.style.display = 'block';
        videoH.style.display = 'none';
        videoV.play();
    } else {
        // Horizontal
        videoH.style.display = 'block';
        videoV.style.display = 'none';
        videoH.play();
    }
}

// Configurar listeners
window.addEventListener('resize', updateVideoOrientation);
window.addEventListener('load', () => {
    updateVideoOrientation();

    // Escuchar cuando termina cada video
    [videoH, videoV].forEach(video => {
        video.addEventListener('ended', showIframe);
        // Mostrar video una vez cargado
        video.style.display = 'block';
    });
});