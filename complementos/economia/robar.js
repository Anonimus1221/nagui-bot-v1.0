const fs = require('fs-extra');
const path = require('path');

module.exports = {
  nome: 'robar',
  desc: 'Roba a un usuario',
  run: async (client, message, args) => {
    try {
      const userId = message.key.participant || message.key.remoteJid;
      const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      if (mentioned.length === 0) {
        return client.sendMessage(message.key.remoteJid, { text: 'Menciona a un usuario para robar.' });
      }

      const targetId = mentioned[0];
      if (targetId === userId) {
        return client.sendMessage(message.key.remoteJid, { text: 'No puedes robarte a ti mismo.' });
      }
      const userFile = path.join(__dirname, '../../data', `${userId}.json`);
      const targetFile = path.join(__dirname, '../../data', `${targetId}.json`);

      let userData = { saldo: 1000 };
      let targetData = { saldo: 1000 };

      if (await fs.pathExists(userFile)) {
        userData = await fs.readJson(userFile);
      }
      if (await fs.pathExists(targetFile)) {
        targetData = await fs.readJson(targetFile);
      }

      if (targetData.saldo <= 0) {
        return client.sendMessage(message.key.remoteJid, { text: 'El usuario no tiene monedas para robar.' });
      }

      // Probabilidad de éxito y de contraataque
      const roll = Math.random();
      if (roll < 0.25) {
        // Contraataque: el usuario objetivo te pilla
        return client.sendMessage(message.key.remoteJid, { text: `¡No pudiste robar! El usuario te pilló y evitó el robo.` });
      } else if (roll < 0.65) {
        // Robo fallido
        return client.sendMessage(message.key.remoteJid, { text: 'Fallaste en el robo.' });
      } else {
        // Robo exitoso
        const stolen = Math.floor(Math.random() * targetData.saldo) + 1;
        userData.saldo += stolen;
        targetData.saldo -= stolen;
        await fs.writeJson(userFile, userData);
        await fs.writeJson(targetFile, targetData);
        client.sendMessage(message.key.remoteJid, { text: `Robaste ${stolen} monedas a @${targetId.split('@')[0]}. Tu saldo: ${userData.saldo}.`, mentions: [targetId] });
      }
    } catch (error) {
      console.error(error);
      client.sendMessage(message.key.remoteJid, { text: 'Error al robar.' });
    }
  }
};