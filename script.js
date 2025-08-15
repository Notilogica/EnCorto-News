// script.js (Código completo y correcto)

// Netlify reemplaza esto con el valor de la variable de entorno durante el "build"
const REPLIT_URL = "${REPLIT_URL}";

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

// --- Eventos iniciales ---
window.addEventListener('load', () => {
  updateVideoOrientation();
  [videoH, videoV].forEach(video => {
    video.addEventListener('ended', showIframe);
    video.style.display = 'block';
  });
});

window.addEventListener('resize', updateVideoOrientation);

// --- Comunicación con iframe ---
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