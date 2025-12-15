const fs = require('fs');
const path = require('path');

module.exports = {
  nome: 'detectarbots',
  desc: 'Activa/desactiva la detección automática de bots en el grupo (admins)',
  run: async (client, msg, args) => {
    try {
      const from = msg.from;
      const isGroup = from.includes('@g.us') || from.includes('@lid');
      if (!isGroup) {
        return msg.reply('Este comando solo funciona en grupos.');
      }

      // Verificar si es admin
      const chat = await msg.getChat();
      const sender = msg.key.participant || msg.author || msg.from;
      const participant = chat.participants.find(p => p.id._serialized === sender);
      if (!participant || !participant.isAdmin) {
        return msg.reply('Solo admins pueden usar este comando.');
      }

      // Verificar si el bot es admin
      const botParticipant = chat.participants.find(p => p.id._serialized === client.info.wid._serialized);
      if (!botParticipant || !botParticipant.isAdmin) {
        return msg.reply('El bot necesita ser admin para expulsar miembros.');
      }

      const action = args[0]?.toLowerCase();
      if (action === 'on') {
        global.detectarbots = global.detectarbots || {};
        global.detectarbots[from] = true;
        msg.reply('Detección automática de bots activada. Los usuarios que envíen comandos con prefijos serán expulsados.');
      } else if (action === 'off') {
        if (global.detectarbots) {
          delete global.detectarbots[from];
        }
        msg.reply('Detección automática de bots desactivada.');
      } else {
        const status = global.detectarbots && global.detectarbots[from] ? 'activada' : 'desactivada';
        msg.reply(`Detección automática de bots está ${status}. Usa .detectarbots on/off para cambiar.`);
      }
    } catch (error) {
      console.error('Error en detectar_bots:', error);
      msg.reply('Error al gestionar la detección de bots.');
    }
  }
};