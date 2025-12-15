const fs = require('fs-extra');
const path = require('path');

const configFile = path.join(__dirname, '../../data/antilinkconfig.json');
const warningsFile = path.join(__dirname, '../../data/link_warnings.json');

async function getConfig(groupId) {
  try {
    const data = await fs.readJSON(configFile);
    return data[groupId] || { links: false };
  } catch {
    return { links: false };
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

const urlRegex = /(https?:\/\/[^\s]+)/gi;

module.exports = {
  nome: 'antilink',
  desc: 'Anti-link - .antilink on/off',
  run: async (client, message, args) => {
    try {
      const action = args[0]?.toLowerCase();
      const groupId = message.from;
      const chat = await message.getChat();

      if (!chat.isGroup) return message.reply('❌ Solo en grupos.');

      const isAdmin = message.isGroupMsg && (await client.getChatById(message.from)).isAdmin;

      if (action === 'on') {
        if (!isAdmin) return message.reply('❌ Solo admins.');
        await setConfig(groupId, { links: true });
        await chat.sendMessage('✅ *Anti-link ACTIVADO*\n\n⚠️ Se eliminarán todos los links automáticamente\n🚫 3 infracciones = Expulsión\n\n🛡️ El grupo ahora está protegido contra spam de enlaces');
        return;
      } else if (action === 'off') {
        if (!isAdmin) return message.reply('❌ Solo admins.');
        await setConfig(groupId, { links: false });
        await message.reply('❌ Anti-link *desactivado*');
        return;
      } else if (!action) {
        const config = await getConfig(groupId);
        const status = config.links ? '✅ Activado' : '❌ Desactivado';
        await message.reply(`📊 Anti-link: ${status}`);
        return;
      }

      // Si está desactivado, no procesar
      const config = await getConfig(groupId);
      if (!config.links) return;

      // Detectar links
      if (urlRegex.test(message.body)) {
        console.log(`🔗 Link detectado de ${message.author}`);

        let warnings = await getWarnings(groupId, message.author);
        warnings = await addWarning(groupId, message.author);

        try {
          await message.delete(true);
          console.log('✅ Mensaje eliminado para todos');
        } catch (e) {
          console.log('No se pudo eliminar el mensaje');
        }

        const senderName = message.author?.split('@')[0] || 'Usuario';
        let response = '';

        if (warnings === 1) {
          response = `⛔ *${senderName}* - Links no permitidos\n\n⚠️ *Advertencia 1/3*\n💬 Próxima infracción: Silencio`;
        } else if (warnings === 2) {
          response = `⛔ *${senderName}* - Links no permitidos\n\n⚠️ *Advertencia 2/3*\n🔇 Próxima infracción: Expulsión`;
        } else if (warnings >= 3) {
          response = `⛔ *${senderName}* - Links no permitidos\n\n❌ *3 Advertencias superadas - EXPULSADO*`;

          try {
            setTimeout(async () => {
              try {
                const participant = await chat.getParticipant(message.author);
                await participant.remove();
                console.log(`✅ ${senderName} fue expulsado del grupo`);
                
                await chat.sendMessage(`🚪 ${senderName} fue expulsado por envío continuo de links`);
                await clearWarnings(groupId, message.author);
              } catch (removeError) {
                console.error('Error expulsando usuario:', removeError.message);
                const participant = await chat.getParticipant(message.author);
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
    } catch (error) {
      console.error('Error en antilink:', error);
    }
  }
};
