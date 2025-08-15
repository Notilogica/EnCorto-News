const fetch = require('node-fetch');

const REPLIT_DOMAIN = process.env.REPLIT_URL; // tu URL de Replit como secreto
const OFFICIAL_DOMAIN = 'https://mx.encortonews.qzz.io';

exports.handler = async function(event, context) {
  try {
    // Obtener RSS desde Replit
    const response = await fetch(`${REPLIT_DOMAIN}/rss`);
    let rssText = await response.text();

    // 🔹 NO escapamos el XML completo
    // 🔹 Solo reemplazamos las URLs de Replit por el dominio oficial
    const updatedRss = rssText.replace(new RegExp(REPLIT_DOMAIN, 'g'), OFFICIAL_DOMAIN);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
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