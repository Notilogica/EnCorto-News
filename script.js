// app.js

document.addEventListener('DOMContentLoaded', () => {
    const videoHorizontal = document.getElementById('video-horizontal');
    const videoVertical = document.getElementById('video-vertical');
    const iframeContainer = document.getElementById('iframe-container');
    const appFrame = document.getElementById('app-frame');

    // Preloader opcional (puede ser visible al inicio del video)
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = `<div class="spinner"></div><p>Cargando Noticias...</p>`;
    document.body.appendChild(preloader);

    // Detecta orientación
    function detectOrientation() {
        return window.innerWidth > window.innerHeight ? 'horizontal' : 'vertical';
    }

    // Muestra el video correspondiente
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

    // Función que carga la URL del backend
    async function loadAppUrl() {
        try {
            const res = await fetch('https://33243b64-65f9-4988-8d60-13ca62670193-00-3oapw4fw99k9c.picard.replit.dev/api/app-url');
            const data = await res.json();
            if (data.url) {
                appFrame.src = data.url;

                // Cuando el iframe está listo
                appFrame.onload = () => {
                    // Verifica si el video aún está reproduciéndose
                    const currentVideo = showIntroVideo();
                    if (!currentVideo.ended) {
                        // Ajusta la duración del video para que termine cuando el iframe esté listo
                        currentVideo.playbackRate = currentVideo.duration / currentVideo.currentTime;
                    }

                    // Transición suave
                    preloader.style.opacity = 0;
                    setTimeout(() => {
                        preloader.style.display = 'none';
                        currentVideo.style.display = 'none';
                        iframeContainer.style.display = 'block';
                    }, 600);
                };
            } else {
                console.error('No se recibió URL del backend');
                preloader.innerHTML = `<p>Error al cargar la app</p>`;
            }
        } catch (err) {
            console.error('Error al obtener URL del backend:', err);
            preloader.innerHTML = `<p>Error al cargar la app</p>`;
        }
    }

    function init() {
        const video = showIntroVideo();

        // Al finalizar el video, mostrar iframe si ya está cargado
        video.addEventListener('ended', () => {
            video.style.display = 'none';
            iframeContainer.style.display = 'block';
            preloader.style.display = 'none';
        });

        // Cambiar video al girar pantalla
        window.addEventListener('resize', () => {
            showIntroVideo();
        });

        loadAppUrl();
    }

    init();
});