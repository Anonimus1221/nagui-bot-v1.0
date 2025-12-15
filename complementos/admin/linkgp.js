module.exports = {
  nome: 'linkgp',
  desc: 'Obtener el link de invitación del grupo',
  run: async (client, msg, args) => {
    try {
      if (!msg.from.includes('@g.us') && !msg.from.includes('@lid')) return client.sendMessage(msg.from, { text: 'Este comando solo funciona en grupos.' });

      const chat = await msg.getChat();

      const sender = msg.author || msg.from;
      const isAdmin = chat.participants.find(p => p.id._serialized === sender)?.isAdmin || false;
      const ownerNumber = (global.config.criadorNumber || '').replace(/[^0-9]/g, '');
      const senderNumber = sender.replace(/[^0-9]/g, '');
      const isOwner = ownerNumber && senderNumber && ownerNumber === senderNumber;

      if (!isAdmin && !isOwner) return client.sendMessage(msg.from, { text: 'Solo administradores pueden usar este comando.' });

      // Verificar si el bot es admin
      const botParticipant = chat.participants.find(p => p.id._serialized === client.info.wid._serialized);
      if (!botParticipant?.isAdmin) return client.sendMessage(msg.from, { text: 'El bot debe ser administrador para usar este comando.' });

      const inviteCode = await chat.getInviteCode();
      const link = `https://chat.whatsapp.com/${inviteCode}`;
      await chat.sendMessage(`Link del grupo: ${link}`);
    } catch (error) {
      console.error(error);
      client.sendMessage(msg.from, { text: 'Error al obtener el link del grupo.' });
    }
  }
};