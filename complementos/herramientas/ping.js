module.exports = {
  nome: 'ping',
  desc: 'Muestra la latencia del bot',
  run: async (client, msg, args) => {
    try {
      const timestamp = Date.now();
      const reply = await msg.reply('🏓 Pong!');
      const latency = Date.now() - timestamp;
      await reply.edit(`🏓 Pong!\n⚡ Latencia: ${latency}ms`);
    } catch (error) {
      console.error('Error en ping:', error);
      await msg.reply('❌ Error al medir latencia.');
    }
  }
};