const fs = require('fs-extra');
const path = require('path');

const subbotsPath = path.join(__dirname, '../../data/subbots.json');
let subbotsData = {};

// Cargar subbots existentes
if (fs.existsSync(subbotsPath)) {
  try {
    subbotsData = fs.readJsonSync(subbotsPath);
  } catch (e) {
    console.error('Error cargando subbots.json:', e);
  }
}

module.exports = {
  nome: 'subbot',
  desc: 'Administra sub-bots (solo para el dueño)',
  run: async (client, msg, args) => {
    try {
      const sender = msg.author || msg.from;
      const ownerNumber = (global.config.criadorNumber || '').replace(/[^0-9]/g, '');
      const senderNumber = sender.replace(/[^0-9]/g, '');
      const isOwner = ownerNumber && senderNumber && ownerNumber === senderNumber;

      if (!isOwner) {
        return await msg.reply('❌ Solo el dueño puede usar este comando.');
      }

      const action = args[0];

      if (!action || action === 'help') {
        const help = `
🤖 *Comandos de Sub-bot:*

!subbot add <número> - Añadir sub-bot
!subbot list - Listar sub-bots
!subbot remove <número> - Remover sub-bot
!subbot clear - Limpiar todos los sub-bots

Ejemplo: !subbot add 573001234567
        `;
        return await msg.reply(help);
      }

      if (action === 'add') {
        const number = args[1];
        if (!number || !/^\d+$/.test(number)) {
          return await msg.reply('⚠️ Uso: !subbot add <número>\nEjemplo: !subbot add 573001234567');
        }

        const subbotId = number + '@c.us';
        const groupId = msg.from;

        if (!subbotsData[groupId]) subbotsData[groupId] = [];
        
        if (subbotsData[groupId].includes(subbotId)) {
          return await msg.reply(`⚠️ El número ${number} ya está registrado como sub-bot.`);
        }

        subbotsData[groupId].push(subbotId);
        fs.ensureDirSync(path.dirname(subbotsPath));
        fs.writeJsonSync(subbotsPath, subbotsData);
        
        await msg.reply(`✅ Sub-bot ${number} registrado exitosamente.`);
        console.log(`✅ Sub-bot agregado: ${subbotId}`);
      }

      else if (action === 'list') {
        const groupId = msg.from;
        const bots = subbotsData[groupId] || [];
        
        if (bots.length === 0) {
          return await msg.reply('📋 No hay sub-bots registrados en este grupo.');
        }

        let list = '📋 *Sub-bots Registrados:*\n\n';
        bots.forEach((bot, i) => {
          list += `${i + 1}. ${bot.replace('@c.us', '')}\n`;
        });
        
        await msg.reply(list);
      }

      else if (action === 'remove') {
        const number = args[1];
        if (!number) {
          return await msg.reply('⚠️ Uso: !subbot remove <número>');
        }

        const subbotId = number + '@c.us';
        const groupId = msg.from;

        if (!subbotsData[groupId] || !subbotsData[groupId].includes(subbotId)) {
          return await msg.reply(`⚠️ El sub-bot ${number} no está registrado.`);
        }

        subbotsData[groupId] = subbotsData[groupId].filter(id => id !== subbotId);
        fs.writeJsonSync(subbotsPath, subbotsData);
        
        await msg.reply(`✅ Sub-bot ${number} removido.`);
      }

      else if (action === 'clear') {
        delete subbotsData[msg.from];
        fs.writeJsonSync(subbotsPath, subbotsData);
        await msg.reply('✅ Todos los sub-bots fueron removidos de este grupo.');
      }

      else {
        await msg.reply('❌ Comando no reconocido. Usa: !subbot help');
      }
    } catch (error) {
      console.error('Error en subbot:', error);
      await msg.reply('❌ Error al procesar comando de sub-bot.');
    }
  }
};