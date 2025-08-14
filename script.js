document.addEventListener('DOMContentLoaded', () => {
    const videoHorizontal = document.getElementById('video-horizontal');
    const videoVertical = document.getElementById('video-vertical');
    const iframeContainer = document.getElementById('iframe-container');
    const appFrame = document.getElementById('app-frame');

    const BACKEND_URL = 'https://33243b64-65f9-4988-8d60-13ca62670193-00-3oapw4fw99k9c.picard.replit.dev/'; 

    // Preloader
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = `<div class="spinner"></div><p>Cargando Noticias...</p>`;
    document.body.appendChild(preloader);

    // Detecta orientación
    function detectOrientation() {
        return window.innerWidth > window.innerHeight ? 'horizontal' : 'vertical';
    }

    function showIntroVideo() {
        const orientation = detectOrientation();
        if (orientation === 'horizontal') {
            videoHorizontal.style.display = 'block';
            videoVertical.style.display = 'none';
            return videoHorizontal;
        } else {
            videoVertical.style.display = 'block';
            videoHorizontal.style.display = 'none';
            return videoVertical;
        }
    }

    async function preloadNews() {
        try {
            const res = await fetch(`${BACKEND_URL}/api/news/principal`);
            if (!res.ok) throw new Error('Error al cargar noticias');
            const news = await res.json();
            sessionStorage.setItem('principalNews', JSON.stringify(news));
            return news;
        } catch (err) {
            console.warn('No se pudieron precargar noticias principales:', err);
            return [];
        }
    }

    async function loadAppUrl() {
        try {
            await preloadNews();
            appFrame.src = BACKEND_URL;
        } catch (err) {
            console.error('Error al cargar la app:', err);
            preloader.innerHTML = `<p>Error al cargar la app: ${err.message}</p>`;
        }
    }

    function hideVideoAndPreloader() {
        preloader.style.opacity = 0;
        setTimeout(() => {
            preloader.style.display = 'none';
            videoHorizontal.style.display = 'none';
            videoVertical.style.display = 'none';
            iframeContainer.style.display = 'block';

            try {
                const news = sessionStorage.getItem('principalNews');
                if (news) {
                    appFrame.contentWindow.postMessage({ type: 'LOAD_NEWS', news: JSON.parse(news) }, '*');
                }
            } catch (err) {
                console.warn('No se pudieron enviar las noticias al iframe:', err);
            }
        }, 500);
    }

    function init() {
        const video = showIntroVideo();
        iframeContainer.style.display = 'none';

        window.addEventListener('resize', () => showIntroVideo());

        // Fin del video
        video.addEventListener('ended', hideVideoAndPreloader);

        // Iframe cargado
        appFrame.addEventListener('load', () => {
            hideVideoAndPreloader();
        });

        loadAppUrl();
    }

    init();
});