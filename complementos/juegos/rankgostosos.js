const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
  nome: 'rankgostosos',
  desc: 'Muestra el ranking de los más atractivos',
  run: async (client, msg, args) => {
    try {
      if (!msg.from.endsWith('@g.us')) return client.sendMessage(msg.from, { text: 'Este comando solo funciona en grupos.' });

      const chat = await msg.getChat();

      const rankings = chat.participants.map(p => {
        const percentage = Math.floor(Math.random() * 100) + 1;
        return { user: p.id._serialized, percentage };
      }).sort((a, b) => b.percentage - a.percentage).slice(0, 10);

      let text = '😍 *Ranking de los Más Atractivos* 😍\n\n';
      rankings.forEach((r, i) => {
        text += `${i + 1}. @${r.user.split('@')[0]} - ${r.percentage}%\n`;
      });

      const imagePath = global.fotos?.rankgostosos || 'src/img/rankgostosos.png';
      const media = MessageMedia.fromFilePath(imagePath);
      client.sendMessage(msg.from, media, {
        caption: text,
        mentions: rankings.map(r => r.user)
      });
    } catch (error) {
      console.error(error);
      client.sendMessage(msg.from, { text: 'Error al generar el ranking.' });
    }
  }
};