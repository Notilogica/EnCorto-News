(async function() {
    // --- Obtener URL de Replit desde Netlify Function ---
    try {
        const res = await fetch('/.netlify/functions/getReplitUrl');
        const url = await res.text();
        window.REPLIT_URL = url;
        console.log("Replit URL cargada desde Netlify:", window.REPLIT_URL);

        // --- Asignar al iframe y RSS ---
        const iframe = document.getElementById('iframe-news');
        const rssLink = document.getElementById('rss-link');
        iframe.src = `${url}/`;
        rssLink.href = `${url}/rss`;

        // --- Variables de video ---
        const videoH = document.getElementById('video-horizontal');
        const videoV = document.getElementById('video-vertical');
        const videoContainer = document.getElementById('videoContainer');
        const iframeContainer = document.getElementById('iframe-container');

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
                iframe.src = `${url}/`;
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
                videoContainer.style.display = 'none';
                iframeContainer.style.display = 'flex';
                iframe.src = `${url}${window.location.pathname}`;
            }
        }

        // --- Comunicación con iframe ---
        window.addEventListener('message', (event) => {
            const data = event.data;
            if (data.type === 'newsUrl' && data.url) {
                history.pushState(null, '', data.url);
            }
            if (data.type === 'loadNewsFromUrl' && data.url) {
                if (data.url === '/') {
                    iframe.src = `${url}/`;
                    history.pushState(null, '', '/');
                } else {
                    iframe.src = `${url}${data.url}`;
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

    } catch (err) {
        console.error("Error al obtener la URL de Replit:", err);
    }
})();

