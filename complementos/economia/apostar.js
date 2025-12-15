const fs = require('fs-extra');
const path = require('path');

module.exports = {
  nome: 'apostar',
  desc: 'Apuesta monedas',
  run: async (client, msg, args) => {
    try {
      const userId = msg.author || msg.from;
      const amount = parseInt(args[0]);
      if (!amount || amount <= 0) {
        return client.sendMessage(msg.from, { text: 'Especifica una cantidad válida para apostar.' });
      }

      const userFile = path.join(__dirname, '../../data', `${userId}.json`);
      let userData = { saldo: 1000 };
      if (await fs.pathExists(userFile)) {
        userData = await fs.readJson(userFile);
      }

      if (userData.saldo < amount) {
        return client.sendMessage(msg.from, { text: 'No tienes suficiente saldo.' });
      }

      const win = Math.random() > 0.5;
      if (win) {
        userData.saldo += amount;
        await fs.writeJson(userFile, userData);
        client.sendMessage(msg.from, { text: `¡Ganaste! Nuevo saldo: ${userData.saldo} monedas.` });
      } else {
        userData.saldo -= amount;
        await fs.writeJson(userFile, userData);
        client.sendMessage(msg.from, { text: `Perdiste. Nuevo saldo: ${userData.saldo} monedas.` });
      }
    } catch (error) {
      console.error(error);
      client.sendMessage(msg.from, { text: 'Error al apostar.' });
    }
  }
};