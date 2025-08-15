const REPLIT_URL = window.REPLIT_URL;

// --- Manejo dinámico del link RSS ---
const rssLink = document.getElementById('rss-link');
if (rssLink && REPLIT_URL) {
    rssLink.href = `${REPLIT_URL}/rss`;
}

// --- Elementos de video y iframe ---
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
        iframe.src = `${REPLIT_URL}/`;
    }, 800);
}

// --- Lógica de carga inicial ---
function handleInitialLoad() {
    const isHomePage = window.location.pathname === '/' || window.location.pathname === '';
    
    if (isHomePage) {
        updateVideoOrientation();
        [videoH, videoV].forEach(video => {
            video.addEventListener('ended', showIframe);
            video.style.display = 'block';
        });
    } else {
        // Cargar ruta específica desde la URL
        videoContainer.style.display = 'none';
        iframeContainer.style.display = 'flex';
        iframe.src = `${REPLIT_URL}${window.location.pathname}`;
    }
}

// --- Eventos ---
window.addEventListener('load', handleInitialLoad);
window.addEventListener('resize', updateVideoOrientation);

// --- Comunicación con iframe ---
window.addEventListener('message', (event) => {
    const data = event.data;

    // Actualiza URL del navegador al abrir una noticia
    if (data.type === 'newsUrl' && data.url) {
        history.pushState(null, '', data.url);
    }

    // Carga noticias específicas o portada desde el iframe
    if (data.type === 'loadNewsFromUrl' && data.url) {
        iframe.src = data.url === '/' ? `${REPLIT_URL}/` : `${REPLIT_URL}${data.url}`;
        if (data.url === '/') {
            history.pushState(null, '', '/');
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