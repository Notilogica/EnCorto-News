// Obtener URL de Replit desde Netlify Function
fetch('/.netlify/functions/getReplitUrl')
  .then(res => res.text())
  .then(url => {
      window.REPLIT_URL = url;
      const iframe = document.getElementById('iframe-news');
      const rssLink = document.getElementById('rss-link');

      rssLink.href = `${url}/rss`;

      initApp();
  })
  .catch(err => console.error("Error al obtener la URL de Replit:", err));

function initApp() {
    const REPLIT_URL = window.REPLIT_URL;
    const iframe = document.getElementById('iframe-news');
    const videoH = document.getElementById('video-horizontal');
    const videoV = document.getElementById('video-vertical');
    const videoContainer = document.getElementById('videoContainer');
    const iframeContainer = document.getElementById('iframe-container');

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

    function showIframe(path) {
        videoContainer.style.opacity = 0;
        setTimeout(() => {
            videoContainer.style.display = 'none';
            iframeContainer.style.display = 'flex';
            iframe.src = `${REPLIT_URL}${path}`;
        }, 800);
    }

    function handleInitialLoad() {
        // Verifica si hay ?news= en la URL
        const params = new URLSearchParams(window.location.search);
        const newsPath = params.get('news') || window.location.pathname;

        if (window.location.pathname === '/' && !newsPath) {
            updateVideoOrientation();
            [videoH, videoV].forEach(video => {
                video.addEventListener('ended', () => showIframe('/'));
                video.style.display = 'block';
            });
        } else {
            // Cargar noticia desde parámetro ?news o ruta actual
            videoContainer.style.display = 'none';
            iframeContainer.style.display = 'flex';
            iframe.src = `${REPLIT_URL}${newsPath}`;
        }
    }

    window.addEventListener('message', (event) => {
        const data = event.data;
        if (data.type === 'newsUrl' && data.url) history.pushState(null, '', data.url);
        if (data.type === 'loadNewsFromUrl' && data.url) {
            iframe.src = `${REPLIT_URL}${data.url}`;
            if (data.url === '/') history.pushState(null, '', '/');
        }
    });

    window.addEventListener('popstate', () => {
        iframe.contentWindow.postMessage(
            { type: 'loadNewsFromUrl', url: location.pathname },
            '*'
        );
    });

    window.addEventListener('load', handleInitialLoad);
    window.addEventListener('resize', updateVideoOrientation);
}