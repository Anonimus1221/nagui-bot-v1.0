const fs = require('fs-extra');
const path = require('path');

module.exports = {
  nome: 'welcome',
  desc: 'Configura mensajes de bienvenida',
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
          await chat.sendMessage('Solo administradores pueden usar este comando.');
        } catch (e) {
          console.error('Error enviando mensaje:', e);
        }
        return;
      }

      const action = args[0];
      const text = args.slice(1).join(' ');

      if (action === 'on') {
        // Activar bienvenidas
        global.config.welcome = text || 'Bienvenido @user al grupo!';
        // Guardar en archivo
        const configPath = path.join(__dirname, '../../configuracion/config.json');
        fs.writeJsonSync(configPath, global.config, { spaces: 2 });
        try {
          await chat.sendMessage('Mensajes de bienvenida activados.');
        } catch (e) {
          console.error('Error enviando mensaje:', e);
        }
      } else if (action === 'off') {
        // Desactivar
        global.config.welcome = null;
        // Guardar en archivo
        const configPath = path.join(__dirname, '../../configuracion/config.json');
        fs.writeJsonSync(configPath, global.config, { spaces: 2 });
        try {
          await chat.sendMessage('Mensajes de bienvenida desactivados.');
        } catch (e) {
          console.error('Error enviando mensaje:', e);
        }
      } else {
        try {
          await chat.sendMessage('Uso: .welcome on/off [mensaje]');
        } catch (e) {
          console.error('Error enviando mensaje:', e);
        }
      }
    } catch (error) {
      console.error(error);
      try {
        await client.sendMessage(msg.from, { text: 'Error al configurar bienvenidas.' });
      } catch (e) {
        console.error('Error enviando mensaje de error:', e);
      }
    }
  }
};
