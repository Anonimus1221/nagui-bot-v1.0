module.exports = {
  nome: 'promover',
  desc: 'Promueve a un usuario a administrador',
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
      const botId = client.info.wid._serialized;
      const botParticipant = chat.participants.find(p => p.id._serialized === botId);
      if (!botParticipant?.isAdmin) {
        await chat.sendMessage('❌ El bot debe ser administrador para promover usuarios.');
        return;
      }

      const mentioned = msg.mentionedIds;
      if (mentioned.length === 0) {
        await chat.sendMessage('⚠️ Menciona a un usuario para promover.\nEjemplo: !promover @usuario');
        return;
      }

      await chat.promoteParticipants(mentioned);
      const userName = await client.getContactById(mentioned[0]).then(c => c.pushname || c.name || 'Usuario').catch(() => 'Usuario');
      await chat.sendMessage(`⭐ ${userName} ha sido promovido a administrador.`);
    } catch (error) {
      console.error('Error en promover:', error);
      try {
        await msg.getChat().sendMessage('❌ Error al promover.');
      } catch (e) {
        console.error('Error:', e);
      }
    }
  }
};
