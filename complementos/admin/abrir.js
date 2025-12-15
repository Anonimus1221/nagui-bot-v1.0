module.exports = {
  nome: 'abrir',
  desc: 'Abrir el grupo',
  run: async (client, msg, args) => {
    try {
      if (!msg.from.includes('@g.us') && !msg.from.includes('@lid')) {
        return;
      }

      const chat = await msg.getChat();
      const sender = msg.author || msg.from;
      
      // Verificar si el usuario es admin
      const isAdmin = chat.participants.find(p => p.id._serialized === sender)?.isAdmin || false;

      if (!isAdmin) {
        await chat.sendMessage('❌ Solo administradores pueden usar este comando.');
        return;
      }

      // Verificar si el bot es admin
      const botParticipant = chat.participants.find(p => p.id._serialized === client.info.wid._serialized);
      if (!botParticipant?.isAdmin) {
        await chat.sendMessage('❌ El bot debe ser administrador para abrir el grupo.');
        return;
      }

      await chat.setMessagesAdminsOnly(false);
      await chat.sendMessage('🔓 Grupo abierto. Todos pueden escribir mensajes.');
    } catch (error) {
      console.error('Error en abrir:', error);
      try {
        await msg.getChat().sendMessage('❌ Error al abrir el grupo.');
      } catch (e) {
        console.error('Error:', e);
      }
    }
  }
};
