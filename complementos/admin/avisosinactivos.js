const fs = require('fs-extra');
const path = require('path');

const configFile = path.join(__dirname, '../../data/inactivityconfig.json');
const inactivityDataFile = path.join(__dirname, '../../data/inactivity.json');
const reminderFile = path.join(__dirname, '../../data/inactivity_reminders.json');

async function getConfig(groupId) {
  try {
    const data = await fs.readJSON(configFile);
    return data[groupId] || { inactivity: false };
  } catch {
    return { inactivity: false };
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

async function addReminder(groupId, userId) {
  try {
    const data = await fs.readJSON(reminderFile).catch(() => ({}));
    const key = `${groupId}_${userId}`;
    data[key] = (data[key] || 0) + 1;
    await fs.writeJSON(reminderFile, data, { spaces: 2 });
    return data[key];
  } catch {
    return 1;
  }
}

async function getReminderCount(groupId, userId) {
  try {
    const data = await fs.readJSON(reminderFile).catch(() => ({}));
    return data[`${groupId}_${userId}`] || 0;
  } catch {
    return 0;
  }
}

module.exports = {
  nome: 'avisosinactivos',
  desc: 'Avisa a usuarios inactivos - .avisosinactivos on/off (Solo admins)',
  run: async (client, message, args) => {
    try {
      const groupId = message.from;
      const chat = await message.getChat();

      // Verificar si es un grupo
      if (!chat.isGroup) return message.reply('❌ Solo en grupos.');

      const action = args[0]?.toLowerCase();

      // Si hay un comando (on/off o consulta), verificar que sea admin
      if (action === 'on' || action === 'off' || !action) {
        const userId = message.author || message.from;
        const participant = chat.participants.find(p => p.id._serialized === userId);
        const isAdmin = participant && (participant.isAdmin || participant.isSuperAdmin);

        if (!isAdmin) {
          return message.reply('❌ Solo los administradores pueden usar este comando.');
        }

        if (action === 'on') {
          await setConfig(groupId, { inactivity: true });
          await chat.sendMessage('✅ *Sistema de Inactividad ACTIVADO*\n\n📊 Se rastreará la actividad de miembros\n👻 Se mencionará a los usuarios inactivos cada 50 mensajes\n💬 Esto ayuda a mantener el grupo activo y participativo\n\n🎯 ¡Todos a participar!');
          return;
        } else if (action === 'off') {
          await setConfig(groupId, { inactivity: false });
          await message.reply('❌ Sistema de inactividad *desactivado*');
          return;
        } else if (!action) {
          const config = await getConfig(groupId);
          const status = config.inactivity ? '✅ Activado' : '❌ Desactivado';
          await message.reply(`📊 Sistema de Inactividad: ${status}`);
          return;
        }
      }

      // Registrar actividad del usuario (no requiere ser admin)
      const config = await getConfig(groupId);
      if (!config.inactivity) return;

      try {
        let inactivityData = await fs.readJSON(inactivityDataFile).catch(() => ({}));

        if (!inactivityData[groupId]) {
          inactivityData[groupId] = {};
        }

        const userId = message.author || message.from;
        inactivityData[groupId][userId] = (inactivityData[groupId][userId] || 0) + 1;

        await fs.writeJSON(inactivityDataFile, inactivityData, { spaces: 2 });

        // Cada 50 mensajes, mencionar a los 3 más inactivos
        const totalMessages = Object.values(inactivityData[groupId]).reduce((a, b) => a + b, 0);
        
        if (totalMessages % 50 === 0) {
          const sortedByInactivity = Object.entries(inactivityData[groupId])
            .sort((a, b) => a[1] - b[1])
            .slice(0, 3);

          if (sortedByInactivity.length > 0) {
            let mentions = [];
            let inactiveList = '👻 *USUARIOS MÁS INACTIVOS:*\n\n';

            for (const [inactiveUserId, messageCount] of sortedByInactivity) {
              const inactiveName = inactiveUserId.split('@')[0];
              const reminderCount = await addReminder(groupId, inactiveUserId);

              if (reminderCount <= 3) {
                inactiveList += `${mentions.length + 1}. @${inactiveName} - ${messageCount} mensajes\n`;
                mentions.push(inactiveUserId);
              }
            }

            inactiveList += `\n💬 ¡Participen más en las conversaciones!`;

            await chat.sendMessage(inactiveList, { mentions });
          }
        }
      } catch (error) {
        console.log('Error registrando inactividad:', error.message);
      }
    } catch (error) {
      console.error('Error en avisosinactivos:', error);
    }
  }
};