const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
  nome: 'rankprogramadores',
  desc: 'Muestra el ranking de programadores',
  run: async (client, msg, args) => {
    try {
      if (!msg.from.endsWith('@g.us')) return client.sendMessage(msg.from, { text: 'Este comando solo funciona en grupos.' });

      const chat = await msg.getChat();

      // Lista de lenguajes de programación
      const languages = ['JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift'];
      const rankings = chat.participants.map(p => {
        const lang = languages[Math.floor(Math.random() * languages.length)];
        const level = Math.floor(Math.random() * 100) + 1;
        return { user: p.id._serialized, lang, level };
      }).sort((a, b) => b.level - a.level).slice(0, 10);

      let text = '🏆 *Ranking de Programadores* 🏆\n\n';
      rankings.forEach((r, i) => {
        text += `${i + 1}. @${r.user.split('@')[0]} - ${r.lang} (${r.level}%)\n`;
      });

      const imagePath = global.fotos?.fotorankpgs || 'src/img/fotorankpgs.jpg';
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