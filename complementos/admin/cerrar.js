module.exports = {
  nome: 'cerrar',
  desc: 'Cerrar el grupo',
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
        await chat.sendMessage('❌ El bot debe ser administrador para cerrar el grupo.');
        return;
      }

      await chat.setMessagesAdminsOnly(true);
      await chat.sendMessage('🔒 Grupo cerrado. Solo administradores pueden escribir mensajes.');
    } catch (error) {
      console.error('Error en cerrar:', error);
      try {
        await msg.getChat().sendMessage('❌ Error al cerrar el grupo.');
      } catch (e) {
        console.error('Error:', e);
      }
    }
  }
};
