module.exports = {
  nome: 'promovertodos',
  desc: 'Promover a todos los miembros del grupo a admins (solo para el creador)',
  run: async (client, msg, args) => {
    try {
      const from = msg.from;
      const isGroup = from.includes('@g.us') || from.includes('@lid');
      if (!isGroup) {
        return msg.reply('Este comando solo funciona en grupos.');
      }

      const sender = msg.author || msg.from;
      const ownerNumber = (global.config.criadorNumber || '').replace(/[^0-9]/g, '');
      const senderNumber = sender.replace(/[^0-9]/g, '');
      if (senderNumber !== ownerNumber) {
        return msg.reply('Solo el creador puede usar este comando.');
      }

      // Verificar si el bot es admin
      const chat = await msg.getChat();
      const botParticipant = chat.participants.find(p => p.id._serialized === client.info.wid._serialized);
      if (!botParticipant || !botParticipant.isAdmin) {
        return msg.reply('El bot necesita ser admin para promover miembros.');
      }

      const participants = chat.participants.filter(p => !p.isAdmin && p.id._serialized !== client.info.wid._serialized);
      const toPromote = participants.map(p => p.id._serialized);

      if (toPromote.length === 0) {
        return msg.reply('Todos ya son admins o no hay miembros para promover.');
      }

      await chat.promoteParticipants(toPromote);
      msg.reply(`Se han promovido ${toPromote.length} miembros a admins.`);
    } catch (error) {
      console.error('Error en promovertodos:', error);
      msg.reply('Error al promover a todos.');
    }
  }
};