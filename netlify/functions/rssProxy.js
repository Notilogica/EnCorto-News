const fetch = require('node-fetch');

const REPLIT_DOMAIN = process.env.REPLIT_URL; // tu URL de Replit como secreto
const OFFICIAL_DOMAIN = 'https://mx.encortonews.qzz.io';

exports.handler = async function(event, context) {
  try {
    // Obtener RSS de Replit
    const response = await fetch(`${REPLIT_DOMAIN}/rss`);
    let rssText = await response.text();

    // Reemplazar URLs de Replit por dominio oficial
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