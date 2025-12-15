const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

let autoExpulsarInterval = null;
const inactivityPath = path.join(__dirname, '../../data/inactivity.json');
let inactivityData = require(inactivityPath);

module.exports = {
  nome: 'autoexpulsar',
  run: async (sock, m, args) => {
    const from = m.key.remoteJid;
    const isGroup = from.includes('@g.us') || from.includes('@lid');
    if (!isGroup) return await sock.sendMessage(from, { text: 'Este comando solo funciona en grupos.' });

    const sender = m.key.participant || from;

    // Verificar si es admin
    try {
      const groupMetadata = await sock.groupMetadata(from);
      const participant = groupMetadata.participants.find(p => p.id === sender);
      if (!participant || !participant.admin) return await sock.sendMessage(from, { text: 'Solo admins pueden usar este comando.' });

      const action = args[0]?.toLowerCase();
      if (action === 'on') {
        if (autoExpulsarInterval) {
          await sock.sendMessage(from, { text: 'Ya está activado.' });
        } else {
          autoExpulsarInterval = setInterval(async () => {
            const now = Date.now();
            const weekMs = 7 * 24 * 60 * 60 * 1000;
            for (const groupId in inactivityData) {
              try {
                const chat = await sock.groupMetadata(groupId);
                const botId = sock.user.id;
                const botParticipant = chat.participants.find(p => p.id === botId);
                if (!botParticipant || !botParticipant.admin) continue;
                for (const userId in inactivityData[groupId]) {
                  if (now - inactivityData[groupId][userId] > weekMs) {
                    try {
                      await sock.groupParticipantsUpdate(groupId, [userId], 'remove');
                      console.log(chalk.green(`✅ Expulsado ${userId.split('@')[0]} de ${groupId.split('@')[0]} por inactividad`));
                      delete inactivityData[groupId][userId];
                    } catch (error) {
                      console.error(chalk.red(`❌ Error al expulsar ${userId.split('@')[0]}:`), error);
                    }
                  }
                }
                if (Object.keys(inactivityData[groupId]).length === 0) delete inactivityData[groupId];
                fs.writeFileSync(inactivityPath, JSON.stringify(inactivityData, null, 2));
              } catch (error) {
                console.error(chalk.red(`❌ Error procesando grupo ${groupId.split('@')[0]}:`), error);
              }
            }
          }, 24 * 60 * 60 * 1000);
          await sock.sendMessage(from, { text: '✅ Autoexpulsión por inactividad activada.' });
        }
      } else if (action === 'off') {
        if (autoExpulsarInterval) {
          clearInterval(autoExpulsarInterval);
          autoExpulsarInterval = null;
          await sock.sendMessage(from, { text: '❌ Autoexpulsión por inactividad desactivada.' });
        } else {
          await sock.sendMessage(from, { text: 'Ya está desactivado.' });
        }
      } else {
        // Listar inactividad
        if (!inactivityData[from]) return await sock.sendMessage(from, { text: 'No hay datos de inactividad para este grupo.\nUso: .autoexpulsar on/off' });

        let message = '📊 Usuarios inactivos:\n';
        const now = Date.now();
        for (const userId in inactivityData[from]) {
          const lastActive = inactivityData[from][userId];
          const daysInactive = Math.floor((now - lastActive) / (24 * 60 * 60 * 1000));
          message += `👤 @${userId.split('@')[0]}: ${daysInactive} días inactivo\n`;
        }
        message += '\nUso: .autoexpulsar on/off';
        await sock.sendMessage(from, { text: message, mentions: Object.keys(inactivityData[from]).map(id => id) });
      }
    } catch (error) {
      console.error(chalk.red('❌ Error al ejecutar el comando:'), error);
      await sock.sendMessage(from, { text: 'Error al ejecutar el comando.' });
    }
  }
};
