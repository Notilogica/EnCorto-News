// script.js (Código completo y final)

// Netlify reemplaza esto con el valor de la variable de entorno durante el "build"
const REPLIT_URL = "${REPLIT_URL}";

const videoH = document.getElementById('video-horizontal');
const videoV = document.getElementById('video-vertical');
const videoContainer = document.getElementById('videoContainer');
const iframeContainer = document.getElementById('iframe-container');
const iframe = document.getElementById('iframe-news');

// --- Lógica de inicialización (se ejecuta al inicio) ---
function initializePage() {
    // Configura las URLs del iframe y el feed RSS
    iframe.src = `${REPLIT_URL}`;
    document.getElementById('rss-link').href = `${REPLIT_URL}/rss`;

    // Llama a la lógica de videos si la URL es la página principal
    if (window.location.pathname === '/') {
        updateVideoOrientation();
        [videoH, videoV].forEach(video => {
            video.addEventListener('ended', showIframe);
            video.style.display = 'block';
        });
    } else {
        // Si la URL ya tiene una noticia (ej. /noticia/slug), omite el video
        videoContainer.style.display = 'none';
        iframeContainer.style.display = 'flex';
        iframe.src = `${REPLIT_URL}${window.location.pathname}`;
    }
}

// --- Manejo de orientación de video ---
function updateVideoOrientation() {
    if (window.innerHeight > window.innerWidth) {
        videoV.style.display = 'block';
        videoH.style.display = 'none';
        videoV.play();
    } else {
        videoH.style.display = 'block';
        videoV.style.display = 'none';
        videoH.play();
    }
}

// --- Ocultar videos y mostrar iframe ---
function showIframe() {
    videoContainer.style.opacity = 0;
    setTimeout(() => {
        videoContainer.style.display = 'none';
        iframeContainer.style.display = 'flex';
        iframe.src = `${REPLIT_URL}/`;
    }, 800);
}

// --- Eventos ---
window.addEventListener('load', initializePage);
window.addEventListener('resize', updateVideoOrientation);

// --- Comunicación con iframe y manejo de historial ---
window.addEventListener('message', (event) => {
    const data = event.data;
    if (data.type === 'newsUrl' && data.url) {
        history.pushState(null, '', data.url);
    }
    if (data.type === 'loadNewsFromUrl' && data.url) {
        iframe.src = `${REPLIT_URL}${data.url}`;
        if (data.url === '/') {
            history.pushState(null, '', '/');
        }
    }
});

window.addEventListener('popstate', () => {
    iframe.contentWindow.postMessage(
        { type: 'loadNewsFromUrl', url: location.pathname },
        '*'
    );
});