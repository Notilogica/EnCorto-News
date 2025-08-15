// --- Obtener URL de Replit desde Netlify Function ---
fetch('/.netlify/functions/getReplitUrl')
  .then(res => res.text())
  .then(url => {
      window.REPLIT_URL = url;

      const iframe = document.getElementById('iframe-news');
      const rssLink = document.getElementById('rss-link');

      // Asignar RSS
      rssLink.href = `${url}/rss`;

      // Inicializar la app
      initApp();
  })
  .catch(err => console.error("Error al obtener la URL de Replit:", err));

function initApp() {
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

    // --- Mostrar iframe después del video ---
    function showIframe() {
        videoContainer.style.opacity = 0;
        setTimeout(() => {
            videoContainer.style.display = 'none';
            iframeContainer.style.display = 'flex';
            
            // Carga la noticia específica desde Replit según la ruta actual
            const currentPath = window.location.pathname; 
            iframe.src = `${REPLIT_URL}${currentPath}`;
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
            // Ruta específica de noticia: mostrar iframe directamente
            videoContainer.style.display = 'none';
            iframeContainer.style.display = 'flex';
            const currentPath = window.location.pathname;
            iframe.src = `${REPLIT_URL}${currentPath}`;
        }
    }

    // --- Comunicación con iframe ---
    window.addEventListener('message', (event) => {
        const data = event.data;

        if (data.type === 'newsUrl' && data.url) {
            history.pushState(null, '', data.url);
        }

        if (data.type === 'loadNewsFromUrl' && data.url) {
            iframe.src = `${REPLIT_URL}${data.url}`;
            if (data.url === '/') history.pushState(null, '', '/');
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
}