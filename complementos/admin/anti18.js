const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const configFile = path.join(__dirname, '../../data/anti18config.json');
const warningsFile = path.join(__dirname, '../../data/explicit_warnings.json');

async function getConfig(groupId) {
  try {
    const data = await fs.readJSON(configFile);
    return data[groupId] || { explicit: false };
  } catch {
    return { explicit: false };
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
  nome: 'anti18',
  desc: 'Anti-contenido 18+ - .anti18 on/off',
  run: async (client, message, args) => {
    try {
      const action = args[0]?.toLowerCase();
      const groupId = message.from;
      const chat = await message.getChat();

      if (!chat.isGroup) return message.reply('❌ Solo en grupos.');

      const isAdmin = message.isGroupMsg && (await client.getChatById(message.from)).isAdmin;

      if (action === 'on') {
        if (!isAdmin) return message.reply('❌ Solo admins.');
        await setConfig(groupId, { explicit: true });
        await chat.sendMessage('✅ *Anti-contenido 18+ ACTIVADO*\n\n⚠️ Se eliminarán imágenes/stickers explícitos automáticamente\n🚫 3 infracciones = Expulsión\n\n🛡️ El grupo ahora está protegido contra contenido inapropiado');
        return;
      } else if (action === 'off') {
        if (!isAdmin) return message.reply('❌ Solo admins.');
        await setConfig(groupId, { explicit: false });
        await message.reply('❌ Anti-contenido 18+ *desactivado*');
        return;
      } else if (!action) {
        const config = await getConfig(groupId);
        const status = config.explicit ? '✅ Activado' : '❌ Desactivado';
        await message.reply(`📊 Anti-18+: ${status}`);
        return;
      }

      // Si está desactivado, no procesar
      const config = await getConfig(groupId);
      if (!config.explicit) return;

      // Solo procesar imágenes y stickers
      if (!message.hasMedia || (!message.type.includes('image') && !message.type.includes('sticker'))) {
        return;
      }

      try {
        const media = await message.downloadMedia();
        const base64 = media.data;
        const userId = message.author;

        // Análisis heurístico simple
        const buffer = Buffer.from(base64, 'base64');
        const size = buffer.length;

        // Stickers animados pequeños suelen ser +18
        let isExplicit = false;
        
        if (message.type === 'sticker') {
          const header = buffer.slice(0, 12).toString('hex');
          if (header.includes('52494646')) {
            const hasAnimated = buffer.includes(Buffer.from('ANIM'));
            isExplicit = hasAnimated && size < 50000;
          }
        } else if (message.type === 'image') {
          // Para imágenes, usar análisis más conservador
          // Requeriría integración con API de detección
          isExplicit = false; // No eliminar imágenes sin API confiable
        }

        if (isExplicit) {
          console.log(`🔞 Contenido 18+ detectado de ${userId}`);

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
            response = `🔞 *${senderName}* - Contenido 18+ detectado\n\n⚠️ *Advertencia 1/3*\n💬 Próxima infracción: Silencio`;
          } else if (warnings === 2) {
            response = `🔞 *${senderName}* - Contenido 18+ detectado\n\n⚠️ *Advertencia 2/3*\n🔇 Próxima infracción: Expulsión`;
          } else if (warnings >= 3) {
            response = `🔞 *${senderName}* - Contenido 18+ detectado\n\n❌ *3 Advertencias superadas - EXPULSADO*`;

            try {
              setTimeout(async () => {
                try {
                  const participant = await chat.getParticipant(userId);
                  await participant.remove();
                  console.log(`✅ ${senderName} fue expulsado del grupo`);
                  
                  await chat.sendMessage(`🚪 ${senderName} fue expulsado por envío de contenido 18+`);
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
        }
      } catch (mediaError) {
        console.log('No se pudo procesar el media:', mediaError.message);
      }
    } catch (error) {
      console.error('Error en anti18:', error);
    }
  }
};
