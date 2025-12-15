module.exports = {
  nome: 'welcome-control',
  desc: 'Controla los mensajes de bienvenida y despedida',
  run: async (client, msg, args) => {
    try {
      const chat = await msg.getChat();
      
      // Verificar si es grupo
      if (!chat.isGroup) {
        return await msg.reply('❌ Este comando solo funciona en grupos.');
      }
      
      // Verificar si es admin
      const groupMetadata = await client.getGroupMetadata(msg.from);
      const userIsAdmin = groupMetadata.participants.some(p => p.id._serialized === msg.author && p.isAdmin);
      
      if (!userIsAdmin) {
        return await msg.reply('❌ Solo los administradores pueden usar este comando.');
      }
      
      const action = (args[0] || '').toLowerCase();
      
      if (action === 'on' || action === 'activar') {
        const text = `✅ *Welcome Activado*\n\n🎉 Se enviarán mensajes de bienvenida y despedida en este grupo.\n\n🤖 Bot Nagui`;
        return await msg.reply(text);
      } 
      else if (action === 'off' || action === 'desactivar') {
        const text = `❌ *Welcome Desactivado*\n\n🚫 Ya no se enviarán mensajes de bienvenida y despedida.\n\n🤖 Bot Nagui`;
        return await msg.reply(text);
      }
      else if (action === 'status' || action === 'estado') {
        const text = `📊 *Estado del Welcome*\n\n🔄 Estado actual: Información disponible en el grupo\n\nUsa:\n• .welcome on - Activar\n• .welcome off - Desactivar`;
        return await msg.reply(text);
      }
      else {
        const text = `🏷️ *Configuración del Welcome*\n\n📝 Opciones disponibles:\n• .welcome on - Activar bienvenidas\n• .welcome off - Desactivar bienvenidas\n• .welcome status - Ver estado actual\n\n🤖 Bot Nagui`;
        return await msg.reply(text);
      }
    } catch (error) {
      console.error('Error en welcome-control:', error);
      await msg.reply('❌ Error al procesar comando.');
    }
  }
};