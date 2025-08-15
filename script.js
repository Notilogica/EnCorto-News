const REPLIT_URL = window.REPLIT_URL;

const videoH = document.getElementById('video-horizontal');
const videoV = document.getElementById('video-vertical');
const videoContainer = document.getElementById('videoContainer');
const iframeContainer = document.getElementById('iframe-container');
const iframe = document.getElementById('iframe-news');

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
        iframe.src = `${REPLIT_URL}/`; // carga Replit directamente
    }, 800);
}

// --- Carga inicial ---
function handleInitialLoad() {
    const isHomePage = window.location.pathname === '/' || window.location.pathname === '';

    if (isHomePage) {
        updateVideoOrientation();
        [videoH, videoV].forEach(video => {
            video.addEventListener('ended', showIframe);
            video.style.display = 'block';
        });
    } else {
        // Ruta específica: carga iframe de inmediato
        videoContainer.style.display = 'none';
        iframeContainer.style.display = 'flex';
        iframe.src = `${REPLIT_URL}${window.location.pathname}`;
    }
}

// --- Comunicación con iframe ---
window.addEventListener('message', (event) => {
    const data = event.data;

    // Actualiza URL cuando se visualiza una noticia
    if (data.type === 'newsUrl' && data.url) {
        history.pushState(null, '', data.url);
    }

    // Cargar noticia específica o volver a inicio
    if (data.type === 'loadNewsFromUrl' && data.url) {
        if (data.url === '/') {
            iframe.src = `${REPLIT_URL}/`;
            history.pushState(null, '', '/');
        } else {
            iframe.src = `${REPLIT_URL}${data.url}`;
        }
    }
});

// --- Manejo de back/forward del navegador ---
window.addEventListener('popstate', () => {
    iframe.contentWindow.postMessage(
        { type: 'loadNewsFromUrl', url: location.pathname },
        '*'
    );
});

// --- Eventos ---
window.addEventListener('load', handleInitialLoad);
window.addEventListener('resize', updateVideoOrientation);