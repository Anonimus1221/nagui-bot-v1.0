const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
  nome: 'beijar',
  desc: 'Enviar beso virtual',
  run: async (client, msg, args) => {
    try {
      if (!msg.from.endsWith('@g.us')) return client.sendMessage(msg.from, { text: 'Este comando solo funciona en grupos.' });

      const chat = await msg.getChat();

      const mentioned = msg.mentionedIds;
      if (mentioned.length === 0) return client.sendMessage(msg.from, { text: 'Menciona a alguien para besar.' });

      const frases = ["💋 Beso carinhoso 💋", "😘 Beso especial 😘", "😍 Beso apasionado 😍", "🥰 Beso dulce 🥰"];
      const frase = frases[Math.floor(Math.random() * frases.length)];

      const fotoPath = global.fotos?.fotobeijo || 'src/img/fotobeijo.png'; // Usar foto de besos si existe

      const media = MessageMedia.fromFilePath(fotoPath);
      client.sendMessage(msg.from, media, {
        caption: `${frase}\n@${msg.author.split('@')[0]} besa a @${mentioned[0].split('@')[0]}`,
        mentions: [msg.author, mentioned[0]]
      });
    } catch (error) {
      console.error(error);
      client.sendMessage(msg.from, { text: 'Error al enviar beso.' });
    }
  }
};