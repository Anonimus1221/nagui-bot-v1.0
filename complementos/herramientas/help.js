module.exports = {
  nome: 'help',
  desc: 'Muestra la lista de comandos',
  run: async (client, msg, args) => {
    try {
      const chat = await msg.getChat();
      let text = `🤖 *Comandos Disponibles en Nagui*\n\n`;
      
      text += `📋 *MENUS:*\n`;
      text += `• .menu - Menú principal\n`;
      text += `• .menuadm - Menú admin\n`;
      text += `• .menubusquedas - Menú de búsquedas\n`;
      text += `• .menudescargas - Menú descargas\n`;
      text += `• .menudono - Menú del dueño\n`;
      text += `• .menueconomia - Menú economía\n`;
      text += `• .menuherramientas - Menú herramientas\n`;
      text += `• .menuias - Menú IA\n\n`;
      
      text += `📥 *DESCARGAS:*\n`;
      text += `• .play <canción> - Descargar música\n`;
      text += `• .ytmp3 <link> - YouTube a MP3\n`;
      text += `• .ytmp4 <link> - YouTube a MP4\n`;
      text += `• .tiktokmp3 <link> - TikTok a MP3\n`;
      text += `• .tiktokmp4 <link> - TikTok a MP4\n\n`;
      
      text += `🎮 *JUEGOS:*\n`;
      text += `• .rankgay - Ranking gay\n`;
      text += `• .rankgostosos - Ranking atractivos\n`;
      text += `• .rankprogramadores - Ranking programadores\n`;
      text += `• .tapa - Tapa\n`;
      text += `• .beijar - Beso\n`;
      text += `• .anime-hello - Saludo anime\n\n`;
      
      text += `🎨 *LOGOS:*\n`;
      text += `• .blackpink • .blood • .dragonball • .fire • .gold\n`;
      text += `• .graffiti • .matrix • .minion • .neon • .shadow\n\n`;
      
      text += `🤖 *IA (INTELIGENCIA ARTIFICIAL):*\n`;
      text += `• .chatgpt <pregunta> - ChatGPT\n`;
      text += `• .gpt4 <pregunta> - GPT-4\n`;
      text += `• .gemini <pregunta> - Gemini\n`;
      text += `• .bard <pregunta> - Bard\n\n`;
      
      text += `👮 *ADMIN (Requiere ser admin del grupo):*\n`;
      text += `• .ban @usuario - Banear usuario\n`;
      text += `• .kick @usuario - Expulsar usuario\n`;
      text += `• .promover @usuario - Promover a admin\n`;
      text += `• .rebaixar @usuario - Quitar admin\n`;
      text += `• .warn @usuario - Advertir\n`;
      text += `• .silenciar @usuario - Silenciar usuario\n`;
      text += `• .dessilenciar @usuario - Dessilenciar usuario\n`;
      text += `• .abrir - Abrir grupo\n`;
      text += `• .cerrar - Cerrar grupo\n`;
      text += `• .welcome on/off - Bienvenidas\n`;
      text += `• .goodbye on/off - Despedidas\n`;
      text += `• .antispam on/off - Anti-spam\n\n`;
      
      text += `💰 *ECONOMÍA:*\n`;
      text += `• .saldo - Ver saldo\n`;
      text += `• .trabajar - Trabajar\n`;
      text += `• .robar @usuario - Robar dinero\n`;
      text += `• .apostar <cantidad> - Apostar\n\n`;
      
      text += `🔍 *BÚSQUEDAS:*\n`;
      text += `• .ytsearch <canción> - Buscar en YouTube\n`;
      text += `• .tiktokstalk @usuario - Información de TikTok\n`;
      text += `• .igstalk @usuario - Información de Instagram\n\n`;
      
      text += `👑 *DUEÑO:*\n`;
      text += `• .downloads - Descargar archivos del servidor\n`;
      text += `• .subbot add - Registrar sub-bot\n`;
      text += `• .subbot list - Listar sub-bots\n`;
      text += `• .subbot remove - Eliminar sub-bot\n`;
      text += `• .expulsar_subbots - Expulsar sub-bots\n`;
      text += `• .promovertodos - Promover a todos\n\n`;
      
      text += `🔧 *HERRAMIENTAS:*\n`;
      text += `• .ping - Latencia del bot\n`;
      text += `• .uptime - Tiempo de actividad\n`;
      text += `• .info - Información del bot\n`;
      text += `• .creator - Información del creador\n`;
      text += `• .hora <país> - Hora actual en un país\n`;
      text += `• .tiktoknotif - Info notificaciones TikTok\n`;
      text += `• .welcome-control - Controlar mensajes de bienvenida\n\n`;
      
      text += `✨ *Usa un menú para más detalles!*`;
      
      await chat.sendMessage(text);
    } catch (error) {
      console.error('Error en help:', error);
      const chat = await msg.getChat();
      await chat.sendMessage('❌ Error al mostrar ayuda.');
    }
  }
};