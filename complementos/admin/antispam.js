const fs = require('fs-extra');
const path = require('path');

module.exports = {
  nome: 'antispam',
  desc: 'Configura anti-spam',
  run: async (client, msg, args) => {
    try {
      if (!msg.from.includes('@g.us') && !msg.from.includes('@lid')) return client.sendMessage(msg.from, { text: 'Este comando solo funciona en grupos.' });

      const chat = await msg.getChat();
      const sender = msg.author || msg.from;
      const isAdmin = chat.participants?.find(p => p.id._serialized === sender)?.isAdmin || false;
      const ownerNumber = (global.config.criadorNumber || '').replace(/[^0-9]/g, '');
      const senderNumber = sender.replace(/[^0-9]/g, '');
      const isOwner = ownerNumber && senderNumber && ownerNumber === senderNumber;

      if (!isAdmin && !isOwner) {
        return client.sendMessage(msg.from, { text: 'Solo administradores pueden usar este comando.' });
      }

      // Verificar si el bot es admin
      const botParticipant = chat.participants.find(p => p.id._serialized === client.info.wid._serialized);
      if (!botParticipant?.isAdmin) {
        return client.sendMessage(msg.from, { text: 'El bot debe ser administrador para usar este comando.' });
      }

      const action = args[0];
      const configPath = path.join(__dirname, '../../configuracion/config.json');

      if (action === 'on') {
        // Activar anti-spam
        global.config.antispam = true;
        await fs.writeJson(configPath, global.config);
        await chat.sendMessage('Anti-spam activado.');
      } else if (action === 'off') {
        // Desactivar
        global.config.antispam = false;
        await fs.writeJson(configPath, global.config);
        await chat.sendMessage('Anti-spam desactivado.');
      } else {
        await chat.sendMessage('Uso: .antispam on/off');
      }
    } catch (error) {
      console.error(error);
      client.sendMessage(msg.from, { text: 'Error al configurar anti-spam.' });
    }
  }
};
