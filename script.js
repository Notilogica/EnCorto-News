// script.js
const REPLIT_API_URL = import.meta.env.VITE_REPLIT_API_URL;

async function fetchNews() {
    if (!REPLIT_API_URL) {
        console.error('❌ La URL de la API de Replit no está configurada.');
        document.getElementById('posts-container').innerHTML = '<p>Error de configuración: La URL de la API no está disponible.</p>';
        return;
    }

    try {
        const response = await fetch(`${REPLIT_API_URL}/api/news`);
        if (!response.ok) {
            throw new Error('Error al obtener las noticias del backend.');
        }
        const newsData = await response.json();
        displayNews(newsData.principal);
    } catch (error) {
        console.error('❌ Error:', error);
        document.getElementById('posts-container').innerHTML = '<p>No se pudieron cargar las noticias. Inténtalo de nuevo más tarde.</p>';
    }
}

function displayNews(posts) {
    const container = document.getElementById('posts-container');
    container.innerHTML = '';

    if (!posts || posts.length === 0) {
        container.innerHTML = '<p>No hay noticias disponibles en este momento.</p>';
        return;
    }

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'news-post';
        postElement.innerHTML = `
            <h3><a href="${REPLIT_API_URL}/${post.link}">${post.title}</a></h3>
            <img src="${post.image}" alt="${post.title}" style="max-width: 100%;">
            <p>${post.summary}</p>
            <small>Fuente: ${post.source}</small>
        `;
        container.appendChild(postElement);
    });
}

fetchNews();