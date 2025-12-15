module.exports = {
  nome: 'tagall',
  desc: 'Marcar a todos los usuarios del grupo',
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
      const participants = chat.participants;
      let text = '¡Atención a todos!\n\n';
      participants.forEach(p => text += `@${p.id.user} `);

      await chat.sendMessage(text, { mentions: participants.map(p => p.id._serialized) });
    } catch (error) {
      console.error('Error en marcar:', error);
      try {
        await client.sendMessage(msg.from, { text: 'Error al marcar.' });
      } catch (e) {
        console.error('Error enviando mensaje de error:', e);
      }
    }
  }
};
