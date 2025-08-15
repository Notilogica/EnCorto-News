const fetch = require('node-fetch'); // o nativo en Node 18+
const REPLIT_DOMAIN = process.env.REPLIT_URL; // ya como secreto
const OFFICIAL_DOMAIN = 'https://mx.encortonews.qzz.io';

exports.handler = async function(event, context) {
    try {
        const response = await fetch(`${REPLIT_DOMAIN}/rss`);
        const rssText = await response.text();

        // Reemplaza URLs de Replit por dominio oficial
        const updatedRss = rssText.replace(new RegExp(REPLIT_DOMAIN, 'g'), OFFICIAL_DOMAIN);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/rss+xml', // obligatorio para IFTTT
                'Cache-Control': 'no-cache'
            },
            body: updatedRss
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: `Error al obtener o modificar RSS: ${error.message}`
        };
    }
};