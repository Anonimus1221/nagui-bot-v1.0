const path = require('path');
const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');

// Función helper para enviar menús con imagen
async function sendMenuWithImage(client, jid, menuText, imagePath) {
  try {
    let media;
    let mediaLoaded = false;

    if (imagePath) {
      // Para archivos locales, usar fromFilePath
      const filePath = path.join(__dirname, '../../', imagePath);
      console.log(`Intentando cargar imagen para menú: ${filePath}`);

      // Verificar que el archivo existe
      if (fs.existsSync(filePath)) {
        try {
          media = await MessageMedia.fromFilePath(filePath);
          mediaLoaded = true;
          console.log('Imagen cargada exitosamente');
        } catch (mediaError) {
          console.error('Error cargando imagen:', mediaError.message);
        }
      } else {
        console.log('Imagen no encontrada:', filePath);
      }
    }

    // Intentar enviar con media si se cargó correctamente
    if (mediaLoaded && media) {
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        await client.sendMessage(jid, media, { caption: menuText });
        console.log('Menú con imagen enviado exitosamente');
      } catch (sendError) {
        console.error('Error enviando imagen, enviando solo texto:', sendError.message);
        await client.sendMessage(jid, menuText);
      }
    } else {
      // Enviar solo texto si no hay media
      console.log('Enviando menú sin imagen');
      await client.sendMessage(jid, menuText);
    }
  } catch (error) {
    console.error('Error general en envío de menú:', error.message);
    await client.sendMessage(jid, menuText);
  }
}

module.exports = {
  nome: 'menu',
  desc: 'Mostrar el menú principal',
  sendMenuWithImage: sendMenuWithImage, // Exportar la función helper
  run: async (client, msg, args) => {
    try {
      const user = (msg.author || msg.from).split('@')[0];
      const menu = `
    ╭━━⪩ INFORMACIÓN DEL BOT ⪨━━
    ▢ • Bot: *Nagui*
    ▢ • Usuario: @${user}
    ▢ • Creador: *${global.criador}*
    ▢ • Versión: *1.5*
    ╰━━─「💜」─━━

    ╭━━⪩ MENÚS DISPONIBLES ⪨━━
    ▢ • .menudono — Menú del Creador
    ▢ • .menuadm — Menú de Administrador
    ▢ • .menuias — Inteligencias Artificiales
    ▢ • .menudescargas — Descargas Multimedia
    ▢ • .menuherramientas — Herramientas
    ▢ • .menubusquedas — Búsquedas
    ▢ • .menulogos — Logos y Efectos
    ▢ • .menustalks — Stalks y Perfiles
    ▢ • .menujuegos — Juegos
    ▢ • .menueconomia — Economía
    ╰━━─「💜」─━━

    ¿Quieres descargar videos, música o imágenes? Usa el menú de descargas y pide el archivo, ¡te lo enviaré aquí mismo!
    `;
      const jid = msg.from;
      // Usar la foto específica del menú principal
      let fotomenu = global.fotos.fotomenu;
      if (!fotomenu) {
        // Fallback a videomenu o la primera imagen disponible
        fotomenu = global.fotos.videomenu;
        if (!fotomenu) {
          // Buscar la primera imagen disponible en fotos.json
          const posibles = Object.values(global.fotos).filter(f => /\.(jpg|jpeg|png|gif|webp|mp4|webm|mov)$/i.test(f));
          fotomenu = posibles[0];
        }
      }
      const isLocal = !/^https?:\/\//i.test(fotomenu);
      const ext = fotomenu.split('.').pop().toLowerCase();
      const isVideo = ['mp4', 'webm', 'mov'].includes(ext);
      // Enviar imagen/video del menú con mejor manejo de errores
      try {
        let media;
        let mediaLoaded = false;

        if (isLocal) {
          // Para archivos locales, usar fromFilePath
          const filePath = path.join(__dirname, '../../', fotomenu);
          console.log('Intentando cargar archivo local:', filePath);

          // Verificar que el archivo existe
          if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            console.log('Archivo encontrado, tamaño:', stats.size, 'bytes');

            // Intentar cargar la media
            try {
              media = await MessageMedia.fromFilePath(filePath);
              mediaLoaded = true;
              console.log('Media cargada exitosamente desde archivo local');
            } catch (mediaError) {
              console.error('Error cargando media:', mediaError.message);
              // Intentar con imagen alternativa
              const fallbackPath = path.join(__dirname, '../../src/img/profilebot.png');
              if (fs.existsSync(fallbackPath)) {
                console.log('Intentando fallback con imagen...');
                media = await MessageMedia.fromFilePath(fallbackPath);
                mediaLoaded = true;
              }
            }
          } else {
            console.log('Archivo no encontrado, usando fallback');
            const fallbackPath = path.join(__dirname, '../../src/img/profilebot.png');
            if (fs.existsSync(fallbackPath)) {
              media = await MessageMedia.fromFilePath(fallbackPath);
              mediaLoaded = true;
            }
          }
        }

        // Intentar enviar con media si se cargó correctamente
        if (mediaLoaded && media) {
          try {
            // Pequeño delay para asegurar estabilidad
            await new Promise(resolve => setTimeout(resolve, 500));
            await client.sendMessage(jid, media, { caption: menu });
            console.log('Mensaje con media enviado exitosamente');
          } catch (sendError) {
            console.error('Error enviando media, enviando solo texto:', sendError.message);
            await client.sendMessage(jid, menu);
          }
        } else {
          // Enviar solo texto si no hay media
          console.log('Enviando menú sin media');
          await client.sendMessage(jid, menu);
        }
      } catch (error) {
        console.error('Error general en menú:', error.message);
        // Fallback final: enviar solo texto
        await client.sendMessage(jid, menu);
      }
    } catch (error) {
      console.error(error);
      msg.reply('Error al mostrar el menú.');
    }
  }
};