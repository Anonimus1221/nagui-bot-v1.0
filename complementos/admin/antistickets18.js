const fs = require('fs-extra');
const path = require('path');

const dataFile = path.join(__dirname, '../../data/antistickets18.json');

async function getConfig(groupId) {
  try {
    const data = await fs.readJSON(dataFile);
    return data[groupId] || { enabled: false };
  } catch {
    return { enabled: false };
  }
}

async function setConfig(groupId, config) {
  try {
    const data = await fs.readJSON(dataFile).catch(() => ({}));
    data[groupId] = { ...data[groupId], ...config };
    await fs.writeJSON(dataFile, data, { spaces: 2 });
  } catch (error) {
    console.error('Error guardando config antistickets18:', error);
  }
}

module.exports = {
  nome: 'antistickets18',
  desc: 'Anti-stickers +18 (activable) - Solo admins',
  run: async (client, msg, args) => {
    try {
      const chat = await msg.getChat();

      // Verificar si es un grupo
      if (!chat.isGroup) {
        return msg.reply('❌ Este comando solo funciona en grupos.');
      }

      // Obtener información del usuario y verificar si es admin
      const senderId = msg.author || msg.from;
      
      let isAdmin = false;
      for (let participant of chat.participants) {
        if (participant.id._serialized === senderId) {
          isAdmin = participant.isAdmin || participant.isSuperAdmin;
          break;
        }
      }

      // Verificar si el usuario es admin
      if (!isAdmin) {
        return msg.reply('❌ Solo los administradores pueden usar este comando.');
      }

      const action = args[0]?.toLowerCase();
      const groupId = msg.from;

      if (action === 'on') {
        await setConfig(groupId, { enabled: true });
        await msg.reply('✅ Anti-stickers +18 *activado*\n\n⚠️ Se detectarán y eliminarán:\n• Stickers explícitos\n• Stickers pornográficos\n• Contenido adulto en stickers\n\n🗑️ Eliminación automática');
      } else if (action === 'off') {
        await setConfig(groupId, { enabled: false });
        await msg.reply('❌ Anti-stickers +18 *desactivado*');
      } else {
        const config = await getConfig(groupId);
        const status = config.enabled ? '✅ Activado' : '❌ Desactivado';
        await msg.reply(`📊 Estado Anti-stickers +18: ${status}`);
      }
    } catch (error) {
      console.error('Error en antistickets18:', error);
      msg.reply('❌ Error procesando comando.');
    }
  }
};