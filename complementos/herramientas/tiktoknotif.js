module.exports = {
  nome: 'tiktoknotif',
  desc: 'Información sobre notificaciones de TikTok',
  run: async (client, message, args) => {
    try {
      const text = `📱 *Notificaciones de TikTok*\n\n⚠️ Las notificaciones automáticas de TikTok requieren configuración de API y base de datos.\n\n💡 Alternativas disponibles:\n• Usa !play para descargar videos de TikTok\n• Usa !tiktokmp3 para descargar audios de TikTok\n• Usa !tiktokmp4 para descargar videos en MP4\n\n📌 Nota: Esta función está en desarrollo.`;
      await message.reply(text);
    } catch (error) {
      console.error('Error en tiktoknotif:', error);
      await message.reply('❌ Error al mostrar información de notificaciones.');
    }
  }
};