module.exports = {
  nome: 'silenciar',
  desc: 'Silencia a un usuario eliminando sus mensajes futuros',
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

      const mentioned = msg.mentionedIds;
      if (mentioned.length === 0) {
        await chat.sendMessage('⚠️ Menciona a un usuario para silenciar.\nEjemplo: !silenciar @usuario');
        return;
      }

      if (mentioned.length > 1) {
        await chat.sendMessage('⚠️ Solo puedes silenciar a un usuario a la vez.');
        return;
      }

      const targetId = mentioned[0];

      if (targetId === client.info.wid._serialized) {
        await chat.sendMessage('❌ No puedo silenciarme a mí mismo.');
        return;
      }

      // Cargar datos de silenciados
      const fs = require('fs-extra');
      const path = require('path');
      const silenciadosPath = path.join(__dirname, '../../data/silenciados.json');
      let silenciadosData = fs.readJsonSync(silenciadosPath, { throws: false }) || {};

      if (!silenciadosData[msg.from]) silenciadosData[msg.from] = [];
      if (!silenciadosData[msg.from].includes(targetId)) {
        silenciadosData[msg.from].push(targetId);
        fs.writeJsonSync(silenciadosPath, silenciadosData);
        const userName = await client.getContactById(targetId).then(c => c.pushname || c.name || 'Usuario').catch(() => 'Usuario');
        await chat.sendMessage(`🔇 ${userName} ha sido silenciado. Sus mensajes serán eliminados automáticamente.`);
      } else {
        await chat.sendMessage('⚠️ Este usuario ya está silenciado.');
      }
    } catch (error) {
      console.error('Error en silenciar:', error);
      try {
        await msg.getChat().sendMessage('❌ Error al silenciar.');
      } catch (e) {
        console.error('Error:', e);
      }
    }
  }
};