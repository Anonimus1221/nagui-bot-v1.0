module.exports = {
  nome: 'grupos-invocar',
  desc: 'Invoca a todos los miembros del grupo',
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
          await client.sendMessage(msg.from, { text: 'Solo administradores pueden usar este comando.' });
        } catch (e) {
          console.error('Error enviando mensaje:', e);
        }
        return;
      }

      const pesan = args.join(' ');
      const oi = pesan ? `*${pesan}*` : '¡Atención a todos!';

      let teks = `╭━━━〔 📢 *INVOCACIÓN GENERAL* 📢 〕━━━⬣
┃ 👥 *Miembros totales:* ${chat.participants.length}
┃ 💬 ${oi}
╰━━━━━━━━━━━━━━━━━━━━⬣

╭━━━〔 👤 *MIEMBROS* 👤 〕━━━⬣
`;

      const mentions = [];
      for (const participant of chat.participants) {
        teks += `┃ @${participant.id.user}\n`;
        mentions.push(participant.id._serialized);
      }

      teks += `╰━━━━━━━━━━━━━━━━━━━━⬣`;

      await chat.sendMessage(teks, { mentions: mentions });
    } catch (error) {
      console.error(error);
      try {
        await client.sendMessage(msg.from, { text: 'Error al invocar.' });
      } catch (e) {
        console.error('Error enviando mensaje de error:', e);
      }
    }
  }
};
