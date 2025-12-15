const fs = require('fs');
const path = require('path');

const subbotsPath = path.join(__dirname, '../../data/subbots.json');
let subbotsData = fs.existsSync(subbotsPath) ? require(subbotsPath) : {};

module.exports = {
  nome: 'expulsar_subbots',
  desc: 'Expulsa sub-bots registrados del grupo (solo para el dueño)',
  run: async (client, msg, args) => {
    try {
      const sender = msg.author || msg.from;
      const ownerNumber = (global.config.criadorNumber || '').replace(/[^0-9]/g, '');
      const senderNumber = sender.replace(/[^0-9]/g, '');
      const isOwner = ownerNumber && senderNumber && ownerNumber === senderNumber;

      if (!isOwner) {
        return msg.reply('Solo el dueño puede usar este comando.');
      }

      const from = msg.from;
      const isGroup = from.includes('@g.us') || from.includes('@lid');
      if (!isGroup) {
        return msg.reply('Este comando solo funciona en grupos.');
      }

      // Verificar si el bot es admin
      const chat = await client.getChatById(from);
      const botParticipant = chat.participants.find(p => p.id._serialized === client.info.wid._serialized);
      if (!botParticipant || !botParticipant.isAdmin) {
        return msg.reply('El bot necesita ser admin para expulsar miembros.');
      }

      const groupSubbots = subbotsData[from] || [];
      if (groupSubbots.length === 0) {
        return msg.reply('No hay sub-bots registrados en este grupo.');
      }

      let expelledCount = 0;
      for (const subbotId of groupSubbots) {
        try {
          await client.groupParticipantsUpdate(from, [subbotId], 'remove');
          console.log(`Expulsado sub-bot: ${subbotId}`);
          expelledCount++;
        } catch (error) {
          console.error(`Error expulsando ${subbotId}:`, error);
        }
      }

      // Limpiar la lista después de expulsar
      delete subbotsData[from];
      fs.writeFileSync(subbotsPath, JSON.stringify(subbotsData, null, 2));

      msg.reply(`Se han expulsado ${expelledCount} sub-bots del grupo.`);
    } catch (error) {
      console.error('Error en expulsar_subbots:', error);
      msg.reply('Error al expulsar sub-bots.');
    }
  }
};