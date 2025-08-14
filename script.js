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

    function hideVideoAndPreloader() {
        preloader.style.opacity = 0;
        setTimeout(() => {
            preloader.style.display = 'none';
            videoHorizontal.style.display = 'none';
            videoVertical.style.display = 'none';
            iframeContainer.style.display = 'block';
        }, 500);
    }

    function init() {
        const video = showIntroVideo();
        iframeContainer.style.display = 'none';

        window.addEventListener('resize', () => showIntroVideo());

        // Listener para recibir noticias desde Replit
        window.addEventListener('message', (event) => {
            if (!event.data || event.data.type !== 'LOAD_NEWS') return;
            const news = event.data.news;

            // Actualiza la sección principal o cualquier otra sección
            const mainSection = document.getElementById('main-news-section');
            if (mainSection && news) {
                mainSection.innerHTML = '<h2>Noticia Principal</h2>' + JSON.stringify(news, null, 2);
            }

            console.log('Noticias recibidas desde Replit:', news);
            hideVideoAndPreloader();
        });

        // Cuando el iframe esté listo, carga el backend
        appFrame.src = BACKEND_URL;

        // Si el video termina antes de recibir noticias, aún ocultamos video/preloader
        video.addEventListener('ended', hideVideoAndPreloader);
    }

    init();
});