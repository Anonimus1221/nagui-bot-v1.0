const fs = require('fs-extra');
const path = require('path');

module.exports = {
  nome: 'saldo',
  desc: 'Muestra tu saldo',
  run: async (client, msg, args) => {
    try {
      const userId = msg.author || msg.from;
      const userFile = path.join(__dirname, '../../data', `${userId}.json`);
      let userData = { saldo: 1000 }; // Saldo inicial
      if (await fs.pathExists(userFile)) {
        userData = await fs.readJson(userFile);
      }
      client.sendMessage(msg.from, { text: `💰 Tu saldo es: ${userData.saldo} monedas.` });
    } catch (error) {
      console.error(error);
      client.sendMessage(msg.from, { text: 'Error al obtener saldo.' });
    }
  }
};