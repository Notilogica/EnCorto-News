// app.js - versión avanzada

document.addEventListener('DOMContentLoaded', () => {
    const videoHorizontal = document.getElementById('video-horizontal');
    const videoVertical = document.getElementById('video-vertical');
    const iframeContainer = document.getElementById('iframe-container');
    const appFrame = document.getElementById('app-frame');

    // Preloader
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = `<div class="spinner"></div><p>Cargando Noticias...</p>`;
    document.body.appendChild(preloader);

    // Detecta orientación
    function detectOrientation() {
        return window.innerWidth > window.innerHeight ? 'horizontal' : 'vertical';
    }

    // Mostrar video según orientación
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

    // Precargar noticias principales en sessionStorage
    async function preloadNews() {
        try {
            const res = await fetch('https://33243b64-65f9-4988-8d60-13ca62670193-00-3oapw4fw99k9c.picard.replit.dev/api/news/principal');
            const news = await res.json();
            sessionStorage.setItem('principalNews', JSON.stringify(news));
            return news;
        } catch (err) {
            console.warn('No se pudieron precargar noticias principales:', err);
            return [];
        }
    }

    // Cargar URL de la app y enviar noticias precargadas
    async function loadAppUrlWithNews() {
        try {
            const res = await fetch('https://33243b64-65f9-4988-8d60-13ca62670193-00-3oapw4fw99k9c.picard.replit.dev/api/app-url');
            const data = await res.json();
            if (!data.url) throw new Error('No se recibió URL del backend');

            appFrame.src = data.url;

            // Cuando el iframe esté listo, inyectar noticias precargadas
            appFrame.onload = () => {
                try {
                    const news = sessionStorage.getItem('principalNews');
                    if (news) {
                        // Envía las noticias al iframe mediante postMessage
                        appFrame.contentWindow.postMessage({ type: 'LOAD_NEWS', news: JSON.parse(news) }, '*');
                    }
                } catch (err) {
                    console.warn('No se pudieron enviar las noticias al iframe:', err);
                }

                // Ocultar preloader y video con transición
                preloader.style.opacity = 0;
                setTimeout(() => {
                    preloader.style.display = 'none';
                    const currentVideo = showIntroVideo();
                    currentVideo.style.display = 'none';
                    iframeContainer.style.display = 'block';
                }, 500);
            };
        } catch (err) {
            console.error('Error al cargar la app:', err);
            preloader.innerHTML = `<p>Error al cargar la app</p>`;
        }
    }

    function init() {
        const video = showIntroVideo();

        // Cambiar video si se gira pantalla
        window.addEventListener('resize', () => {
            showIntroVideo();
        });

        // Inicia precarga de noticias y carga de app
        preloadNews().then(() => loadAppUrlWithNews());

        // Al finalizar el video, asegurarse de mostrar iframe
        video.addEventListener('ended', () => {
            video.style.display = 'none';
            iframeContainer.style.display = 'block';
            preloader.style.display = 'none';
        });
    }

    init();
});