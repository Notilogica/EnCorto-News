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

    // 🔹 Corregir <webMaster> a email válido
    updatedRss = updatedRss.replace(
      /<webMaster><!\[CDATA\[.*?\]\]><\/webMaster>/,
      '<webMaster>admin@encortonews.qzz.io (Encorto News)</webMaster>'
    );

    // 🔹 Asegurar namespace de "media"
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

    // 🔹 Evitar GUID duplicados
    // Creamos un set para llevar el control de GUIDs únicos
    const guidSet = new Set();
    updatedRss = updatedRss.replace(/<guid>(.*?)<\/guid>/g, (match, guid) => {
      let newGuid = guid;
      let counter = 1;
      while (guidSet.has(newGuid)) {
        // Agregar un sufijo único
        newGuid = `${guid}#${counter}`;
        counter++;
      }
      guidSet.add(newGuid);
      return `<guid isPermaLink="false">${newGuid}</guid>`;
    });

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