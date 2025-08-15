const fetch = require('node-fetch');

const REPLIT_DOMAIN = process.env.REPLIT_URL; // tu URL de Replit como secreto
const OFFICIAL_DOMAIN = 'https://mx.encortonews.qzz.io';

exports.handler = async function(event, context) {
  try {
    // Obtener RSS desde Replit
    const response = await fetch(`${REPLIT_DOMAIN}/rss`);
    let rssText = await response.text();

    // 🔹 Reemplazar dominio
    let updatedRss = rssText.replace(new RegExp(REPLIT_DOMAIN, 'g'), OFFICIAL_DOMAIN);

    // 🔹 Corregir <webMaster>: debe ser un email válido
    updatedRss = updatedRss.replace(
      /<webMaster><!\[CDATA\[.*?\]\]><\/webMaster>/,
      '<webMaster>admin@encortonews.qzz.io (Encorto News)</webMaster>'
    );

    // 🔹 Asegurar que existe el namespace de "media"
    if (!updatedRss.includes('xmlns:media=')) {
      updatedRss = updatedRss.replace(
        /<rss(.*?)>/,
        '<rss$1 xmlns:media="http://search.yahoo.com/mrss/">'
      );
    }

    // 🔹 Arreglar self reference en <atom:link>
    updatedRss = updatedRss.replace(
      /<atom:link[^>]*rel="self"[^>]*>/,
      `<atom:link href="${OFFICIAL_DOMAIN}/rss" rel="self" type="application/rss+xml"/>`
    );

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