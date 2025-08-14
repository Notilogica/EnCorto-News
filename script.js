document.addEventListener("DOMContentLoaded", async () => {
    const loader = document.getElementById("loader");
    const iframeContainer = document.getElementById("iframe-container");
    const iframe = document.getElementById("app-frame");

    try {
        const response = await fetch('https://33243b64-65f9-4988-8d60-13ca62670193-00-3oapw4fw99k9c.picard.replit.dev/api/app-url');
        const data = await response.json();

        if (!data.url) throw new Error('URL de la app no disponible');
        iframe.src = data.url;

        // Cuando el iframe carga
        iframe.onload = () => {
            loader.classList.add('fade-out');
            iframeContainer.classList.add('visible');
        };

        // Timeout máximo: si el backend tarda demasiado
        setTimeout(() => {
            loader.classList.add('fade-out');
            iframeContainer.classList.add('visible');
        }, 10000); // 10 segundos

    } catch (error) {
        console.error('Error cargando la app:', error);
        loader.innerHTML = '<p>Error cargando la aplicación. Intenta recargar.</p>';
    }
});