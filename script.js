document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const videoHorizontal = document.getElementById('video-horizontal');
    const videoVertical = document.getElementById('video-vertical');
    const iframeContainer = document.getElementById('iframe-container');
    
    // URL del backend de Replit
    const BACKEND_URL = 'https://33243b64-65f9-4988-8d60-13ca62670193-00-3oapw4fw99k9c.picard.replit.dev/';

    // --- Preloader ---
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = `<div class="spinner"></div><p>Cargando Noticias...</p>`;
    document.body.appendChild(preloader);

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

    function hideVideoAndPreloader() {
        preloader.style.opacity = 0;
        setTimeout(() => {
            preloader.style.display = 'none';
            videoHorizontal.style.display = 'none';
            videoVertical.style.display = 'none';
            // Ahora mostramos el contenido, no el iframe
            // iframeContainer.style.display = 'block';
        }, 500);
    }
    
    // --- Lógica de inicialización ---
    function init() {
        const video = showIntroVideo();
        // Ya no necesitamos ocultar el contenedor del iframe si no lo usamos
        // iframeContainer.style.display = 'none';
        
        window.addEventListener('resize', () => showIntroVideo());
        
        // Función principal que obtiene los datos de la API y los renderiza
        async function fetchAndRenderNews() {
            try {
                console.log('Fetching news from backend:', `${BACKEND_URL}/api/news/principal`);
                const response = await fetch(`${BACKEND_URL}/api/news/principal`);
                
                // Si la respuesta no es exitosa, lanzamos un error
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const news = await response.json();
                
                const mainSection = document.getElementById('main-news-section');
                if (mainSection) {
                    // Creamos dinámicamente el HTML con los datos recibidos
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
                    mainSection.innerHTML = '<h2>Error al cargar la noticia</h2><p>Por favor, inténtelo de nuevo más tarde.</p>';
                }
            } finally {
                // Independientemente del resultado, ocultamos el preloader
                hideVideoAndPreloader();
            }
        }
        
        // Carga las noticias cuando el video de introducción termina
        video.addEventListener('ended', fetchAndRenderNews);
        
        // En caso de que el video ya haya terminado (por un refresh), carga las noticias de inmediato
        if (video.readyState >= 3) { // 3 = HAVE_FUTURE_DATA
            fetchAndRenderNews();
        }
        
        // El listener de postMessage y la carga del iframe ya no son necesarios
    }
    
    init();
});
