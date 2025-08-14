document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const videoHorizontal = document.getElementById('video-horizontal');
    const videoVertical = document.getElementById('video-vertical');
    const mainContent = document.querySelector('main');

    // URL del backend de Replit
    const BACKEND_URL = 'https://33243b64-65f9-4988-8d60-13ca62670193-00-3oapw4fw99k9c.picard.replit.dev/';

    // --- Preloader ---
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = `<div class="spinner"></div><p>Cargando Noticias...</p>`;
    document.body.appendChild(preloader);
    
    // Oculta el contenido principal al inicio para mostrar solo el video y preloader
    mainContent.style.display = 'none';

    // --- Lógica de Orientación y Video ---
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

    // Esta función siempre oculta el preloader y los videos, y muestra el contenido principal
    function hideVideoAndShowContent() {
        preloader.style.opacity = 0;
        setTimeout(() => {
            preloader.style.display = 'none';
            videoHorizontal.style.display = 'none';
            videoVertical.style.display = 'none';
            mainContent.style.display = 'block'; // Muestra el contenido principal
        }, 500);
    }
    
    // --- Lógica de inicialización ---
    function init() {
        const video = showIntroVideo();
        
        window.addEventListener('resize', () => showIntroVideo());
        
        // Función principal que obtiene los datos de la API y los renderiza
        async function fetchAndRenderNews() {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de tiempo de espera
                
                console.log('Fetching news from backend:', `${BACKEND_URL}/api/news/principal`);
                
                const response = await fetch(`${BACKEND_URL}/api/news/principal`, {
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const news = await response.json();
                
                const mainSection = document.getElementById('main-news-section');
                if (mainSection) {
                    mainSection.innerHTML = `
                        <h2>Noticia Principal</h2>
                        <article>
                            <img src="${news.image}" alt="${news.title}" style="max-width: 100%; height: auto; border-radius: 8px;">
                            <h3>${news.title}</h3>
                            <p>${news.summary}</p>
                            <a href="${news.link}" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: none;">Leer más</a>
                        </article>
                    `;
                }

                console.log('Noticia principal recibida y renderizada:', news);

            } catch (error) {
                console.error('Error al obtener o renderizar la noticia principal:', error);
                const mainSection = document.getElementById('main-news-section');
                if (mainSection) {
                    mainSection.innerHTML = `
                        <h2 style="color: red;">Error al cargar la noticia</h2>
                        <p>No pudimos conectar con el servidor. Por favor, asegúrese de que el backend de Replit está activo e intente de nuevo más tarde.</p>
                    `;
                }
            } finally {
                // Siempre ocultamos el video y mostramos el contenido, sin importar si el fetch falló
                hideVideoAndShowContent();
            }
        }
        
        // --- Lógica de la transición ---
        // Esperamos a que el video esté listo para reproducirse
        video.addEventListener('canplaythrough', () => {
             // Oculta el video y muestra el contenido principal después de la duración del video
            setTimeout(() => {
                fetchAndRenderNews();
            }, video.duration * 1000);
        });

         // Si el video ya está listo o se refresca la página, iniciamos la carga de noticias de inmediato
        if (video.readyState >= 4) { // 4 = HAVE_ENOUGH_DATA
            fetchAndRenderNews();
        }
    }
    
    init();
});
