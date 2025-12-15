module.exports = {
  nome: 'uptime',
  desc: 'Muestra el tiempo de actividad del bot',
  run: async (client, msg, args) => {
    try {
      const uptime = process.uptime();
      const days = Math.floor(uptime / 86400);
      const hours = Math.floor((uptime % 86400) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      
      const text = `⏱️ *Tiempo de Actividad del Bot:*\n\n📅 ${days}d ${hours}h ${minutes}m ${seconds}s\n\n✅ Bot funcionando correctamente`;
      await msg.reply(text);
    } catch (error) {
      console.error('Error en uptime:', error);
      await msg.reply('❌ Error al obtener uptime.');
    }
  }
};