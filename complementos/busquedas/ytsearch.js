module.exports = {
  nome: 'ytsearch',
  desc: 'Busca videos en YouTube',
  run: async (client, msg, args) => {
    try {
      const query = args.join(' ');
      if (!query) {
        return await msg.reply('📺 Por favor, proporciona un término de búsqueda.\nEjemplo: !ytsearch metallica enter sandman');
      }

      // Respuesta local con sugerencias
      const searchResults = `
📺 *Búsqueda en YouTube:* ${query}

Para buscar en YouTube desde WhatsApp, puedes usar:
• !play ${query} (descargar música)
• !ytmp4 ${query} (descargar video)

O simplemente abre YouTube.com en tu navegador y busca: "${query}"

🎵 Si quieres descargar este contenido, usa los comandos de arriba.
      `;
      
      await msg.reply(searchResults);
    } catch (error) {
      console.error('Error en ytsearch:', error);
      await msg.reply('❌ Error al buscar.');
    }
  }
};