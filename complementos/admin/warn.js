module.exports = {
  nome: 'advertir',
  desc: 'Da una advertencia a un usuario',
  run: async (client, msg, args) => {
    try {
      if (!msg.from.includes('@g.us') && !msg.from.includes('@lid')) {
        try {
          await client.sendMessage(msg.from, { text: 'Este comando solo funciona en grupos.' });
        } catch (e) {
          console.error('Error enviando mensaje:', e);
        }
        return;
      }

      const chat = await msg.getChat();

      const sender = msg.author || msg.from;
      const isAdmin = chat.participants.find(p => p.id._serialized === sender)?.isAdmin || false;
      const ownerNumber = (global.config.criadorNumber || '').replace(/[^0-9]/g, '');
      const senderNumber = sender.replace(/[^0-9]/g, '');
      const isOwner = ownerNumber && senderNumber && ownerNumber === senderNumber;

      if (!isAdmin && !isOwner) {
        try {
          await chat.sendMessage('Debes ser administrador del grupo para usar este comando.');
        } catch (e) {
          console.error('Error enviando mensaje:', e);
        }
        return;
      }

      const mentioned = msg.mentionedIds;
      if (mentioned.length === 0) {
        try {
          await chat.sendMessage('Menciona a un usuario para advertir.');
        } catch (e) {
          console.error('Error enviando mensaje:', e);
        }
        return;
      }

      const userToWarn = mentioned[0];
      const reason = args.join(' ') || 'Sin razón especificada';

      await chat.sendMessage(`⚠️ Advertencia a @${userToWarn.split('@')[0]}: ${reason}`, { mentions: [userToWarn] });
    } catch (error) {
      console.error(error);
      try {
        await client.sendMessage(msg.from, { text: 'Error al dar advertencia.' });
      } catch (e) {
        console.error('Error enviando mensaje de error:', e);
      }
    }
  }
};
