module.exports = {
  nome: 'rebaixar',
  desc: 'Rebaja a un administrador',
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
        await chat.sendMessage('❌ El bot debe ser administrador para rebaixar usuarios.');
        return;
      }

      const mentioned = msg.mentionedIds;
      if (mentioned.length === 0) {
        await chat.sendMessage('⚠️ Menciona a un usuario para rebaixar.\nEjemplo: !rebaixar @usuario');
        return;
      }

      await chat.demoteParticipants(mentioned);
      const userName = await client.getContactById(mentioned[0]).then(c => c.pushname || c.name || 'Usuario').catch(() => 'Usuario');
      await chat.sendMessage(`📉 ${userName} ha sido rebaixado de administrador.`);
    } catch (error) {
      console.error('Error en rebaixar:', error);
      try {
        await msg.getChat().sendMessage('❌ Error al rebaixar.');
      } catch (e) {
        console.error('Error:', e);
      }
    }
  }
};
