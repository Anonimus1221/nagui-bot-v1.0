const fs = require('fs-extra');
const path = require('path');

module.exports = {
  nome: 'trabajar',
  desc: 'Trabaja para ganar monedas',
  run: async (client, msg, args) => {
    try {
      const userId = msg.author || msg.from;
      const userFile = path.join(__dirname, '../../data', `${userId.replace('@', '_').replace('.', '_')}.json`);
      let userData = { saldo: 1000, lastWork: 0 };
      if (await fs.pathExists(userFile)) {
        userData = await fs.readJson(userFile);
      }

      const now = Date.now();
      const cooldown = 3600000; // 1 hora
      if (now - userData.lastWork < cooldown) {
        const remaining = Math.ceil((cooldown - (now - userData.lastWork)) / 60000);
        return client.sendMessage(msg.from, { text: `Espera ${remaining} minutos para trabajar de nuevo.` });
      }

      const earnings = Math.floor(Math.random() * 100) + 50;
      userData.saldo += earnings;
      userData.lastWork = now;
      await fs.writeJson(userFile, userData);
      client.sendMessage(msg.from, { text: `Trabajaste y ganaste ${earnings} monedas. Saldo total: ${userData.saldo}.` });
    } catch (error) {
      console.error(error);
      client.sendMessage(msg.from, { text: 'Error al trabajar.' });
    }
  }
};