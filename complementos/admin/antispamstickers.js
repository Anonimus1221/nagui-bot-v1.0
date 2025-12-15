const fs = require('fs-extra');
const path = require('path');

const configFile = path.join(__dirname, '../../data/antispamconfig.json');
const dataPath = path.join(__dirname, '../../data/sticker_spam.json');
const warningsFile = path.join(__dirname, '../../data/spam_warnings.json');

async function getConfig(groupId) {
  try {
    const data = await fs.readJSON(configFile);
    return data[groupId] || { stickers: false };
  } catch {
    return { stickers: false };
  }
}

async function setConfig(groupId, config) {
  try {
    const data = await fs.readJSON(configFile).catch(() => ({}));
    data[groupId] = { ...data[groupId], ...config };
    await fs.writeJSON(configFile, data, { spaces: 2 });
  } catch (error) {
    console.error('Error guardando config:', error);
  }
}

async function getWarnings(groupId, userId) {
  try {
    const data = await fs.readJSON(warningsFile).catch(() => ({}));
    return data[`${groupId}_${userId}`] || 0;
  } catch {
    return 0;
  }
}

async function addWarning(groupId, userId) {
  try {
    const data = await fs.readJSON(warningsFile).catch(() => ({}));
    const key = `${groupId}_${userId}`;
    data[key] = (data[key] || 0) + 1;
    await fs.writeJSON(warningsFile, data, { spaces: 2 });
    return data[key];
  } catch {
    return 1;
  }
}

async function clearWarnings(groupId, userId) {
  try {
    const data = await fs.readJSON(warningsFile).catch(() => ({}));
    const key = `${groupId}_${userId}`;
    delete data[key];
    await fs.writeJSON(warningsFile, data, { spaces: 2 });
  } catch (error) {
    console.error('Error limpiando advertencias:', error);
  }
}

module.exports = {
  nome: 'antispamstickers',
  desc: 'Anti-spam de stickers - .antispamstickers on/off (Solo admins)',
  run: async (client, message, args) => {
    try {
      const groupId = message.from;
      const chat = await message.getChat();

      // Verificar si es un grupo
      if (!chat.isGroup) return message.reply('❌ Solo en grupos.');

      const action = args[0]?.toLowerCase();
      
      // Si hay un comando (on/off o consulta), verificar que sea admin
      if (action === 'on' || action === 'off' || !action) {
        // Método alternativo: usar getContact para verificar admin
        try {
          const contact = await message.getContact();
          const isAdmin = contact.isMe || contact.isMyContact || 
                         (chat.participants && chat.participants.some(p => 
                           (p.id._serialized === contact.id._serialized || 
                            p.id.user === contact.id.user) && 
                           (p.isAdmin || p.isSuperAdmin)
                         ));
          
          console.log('Contact ID:', contact.id._serialized);
          console.log('Is Admin:', isAdmin);

          if (!isAdmin) {
            return message.reply('❌ Solo los administradores pueden usar este comando.');
          }
        } catch (err) {
          console.error('Error verificando admin:', err);
          // Si falla la verificación, permitir continuar (fallback)
        }

        if (action === 'on') {
          await setConfig(groupId, { stickers: true });
          await chat.sendMessage('✅ *Anti-spam de stickers ACTIVADO*\n\n⚠️ Límite: 100 stickers en 1 minuto\n🚫 3 infracciones = Expulsión\n\n🛡️ El grupo ahora está protegido contra spam de stickers');
          return;
        } else if (action === 'off') {
          await setConfig(groupId, { stickers: false });
          await message.reply('❌ Anti-spam de stickers *desactivado*');
          return;
        } else if (!action) {
          const config = await getConfig(groupId);
          const status = config.stickers ? '✅ Activado' : '❌ Desactivado';
          await message.reply(`📊 Anti-spam Stickers: ${status}`);
          return;
        }
      }

      // Procesar spam de stickers (no requiere ser admin)
      const config = await getConfig(groupId);
      if (!config.stickers) return;

      let stickerData = await fs.readJSON(dataPath).catch(() => ({}));

      const userId = message.author || message.from;
      const now = Date.now();
      const oneMinuteAgo = now - 60000;

      if (!stickerData[groupId]) stickerData[groupId] = {};
      if (!stickerData[groupId][userId]) stickerData[groupId][userId] = [];

      stickerData[groupId][userId] = stickerData[groupId][userId].filter(time => time > oneMinuteAgo);
      stickerData[groupId][userId].push(now);

      await fs.writeJSON(dataPath, stickerData, { spaces: 2 });

      if (stickerData[groupId][userId].length > 100) {
        console.log(`🚫 SPAM de stickers detectado de ${userId}`);

        let warnings = await getWarnings(groupId, userId);
        warnings = await addWarning(groupId, userId);

        try {
          await message.delete(true);
          console.log('✅ Mensaje eliminado para todos');
        } catch (e) {
          console.log('No se pudo eliminar el mensaje');
        }

        const senderName = userId.split('@')[0];
        let response = '';

        if (warnings === 1) {
          response = `🚫 *${senderName}* - SPAM de stickers detectado\n\n⚠️ *Advertencia 1/3*\n💬 Próxima infracción: Silencio`;
        } else if (warnings === 2) {
          response = `🚫 *${senderName}* - SPAM de stickers detectado\n\n⚠️ *Advertencia 2/3*\n🔇 Próxima infracción: Expulsión`;
        } else if (warnings >= 3) {
          response = `🚫 *${senderName}* - SPAM de stickers detectado\n\n❌ *3 Advertencias superadas - EXPULSADO*`;

          try {
            setTimeout(async () => {
              try {
                const participant = await chat.getParticipant(userId);
                await participant.remove();
                console.log(`✅ ${senderName} fue expulsado del grupo`);
                
                await chat.sendMessage(`🚪 ${senderName} fue expulsado por SPAM continuo de stickers`);
                await clearWarnings(groupId, userId);
              } catch (removeError) {
                console.error('Error expulsando usuario:', removeError.message);
                const participant = await chat.getParticipant(userId);
                await participant.mute(86400000);
                await chat.sendMessage(`⚠️ No pude expulsar a ${senderName}, lo silencié por 24h`);
              }
            }, 1000);
          } catch (e) {
            console.error('Error en proceso de expulsión:', e);
          }
        }

        if (response) {
          await chat.sendMessage(response);
        }

        stickerData[groupId][userId] = [];
        await fs.writeJSON(dataPath, stickerData, { spaces: 2 });
      }
    } catch (error) {
      console.error('Error en antispamstickers:', error);
    }
  }
};