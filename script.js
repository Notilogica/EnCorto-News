document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const videoContainer = document.querySelector('.video-container'); // Nueva referencia al contenedor
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

    // Esta función ahora oculta el contenedor del video y el preloader, y muestra el contenido principal
    function hideVideoAndShowContent() {
        // Ocultamos el contenedor principal del video con una transición suave
        videoContainer.style.opacity = 0;
        preloader.style.opacity = 0;
        setTimeout(() => {
            videoContainer.style.display = 'none';
            preloader.style.display = 'none';
            mainContent.style.display = 'block'; // Muestra el contenido principal
        }, 500);
    }
    
    // --- Lógica de inicialización ---
    function init() {
        const video = showIntroVideo();
        
        window.addEventListener('resize', () => showIntroVideo());
        
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
                hideVideoAndShowContent();
            }
        }
        
        video.addEventListener('ended', fetchAndRenderNews);
        
        if (video.readyState >= 4) {
            fetchAndRenderNews();
        }
    }
    
    init();
});
