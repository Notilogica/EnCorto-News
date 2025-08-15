const fetch = require('node-fetch'); // si Netlify no lo trae por defecto

const REPLIT_DOMAIN = process.env.REPLIT_URL; // URL de Replit desde secreto
const OFFICIAL_DOMAIN = 'https://mx.encortonews.qzz.io';

exports.handler = async function(event, context) {
    try {
        // Obtener el RSS de Replit
        const response = await fetch(`${REPLIT_DOMAIN}/rss`);
        const rssText = await response.text();

        // Reemplazar las URLs de Replit por las del dominio oficial
        const updatedRss = rssText.replace(new RegExp(REPLIT_DOMAIN, 'g'), OFFICIAL_DOMAIN);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/rss+xml'
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