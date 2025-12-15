const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
  nome: 'dragonball',
  desc: 'Genera un logo estilo Dragon Ball con IA',
  run: async (client, message, args) => {
    try {
      const text = args.filter(a => a.trim()).join(' ').trim();
      if (!text || text.length === 0) {
        return message.reply('🔶 Por favor, proporciona un texto para el logo.\n\nEjemplo: .dragonball Mi Texto');
      }

      await message.reply('⏳ Generando logo dragon ball... espera');

      const prompt = `dragon ball logo with text "${text}", anime style, orange dragon ball, energy blast effect, dynamic action, professional design, high quality`;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

      const response = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 60000 });

      const tempDir = path.join(__dirname, '../../temp');
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

      const imgPath = path.join(tempDir, `dragonball_${Date.now()}.png`);
      fs.writeFileSync(imgPath, response.data);

      const media = MessageMedia.fromFilePath(imgPath);
      await message.reply(media, undefined, { caption: `🔶 DRAGON BALL: ${text}` });

      setTimeout(() => { if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath); }, 5000);
    } catch (error) {
      console.error('Error en dragonball:', error.message);
      message.reply('Error al generar el logo.');
    }
  }
};