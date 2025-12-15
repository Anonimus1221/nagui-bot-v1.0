module.exports = {
  nome: 'ban',
  desc: 'Banear a un usuario del grupo',
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
        await chat.sendMessage('❌ El bot debe ser administrador para banear usuarios.');
        return;
      }

      const mentioned = msg.mentionedIds;
      if (mentioned.length === 0) {
        await chat.sendMessage('⚠️ Menciona a un usuario para banear.\nEjemplo: !ban @usuario');
        return;
      }

      await chat.removeParticipants(mentioned);
      const userName = await client.getContactById(mentioned[0]).then(c => c.pushname || c.name || 'Usuario');
      await chat.sendMessage(`✅ ${userName} ha sido baneado del grupo.`);
    } catch (error) {
      console.error('Error en ban:', error);
      try {
        await msg.getChat().sendMessage('❌ Error al banear.');
      } catch (e) {
        console.error('Error:', e);
      }
    }
  }
};
