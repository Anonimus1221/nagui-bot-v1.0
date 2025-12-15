const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
  nome: 'shadow',
  desc: 'Genera un logo estilo sombra con IA',
  run: async (client, message, args) => {
    try {
      const text = args.filter(a => a.trim()).join(' ').trim();
      if (!text || text.length === 0) {
        return message.reply('🌑 Por favor, proporciona un texto para el logo.\n\nEjemplo: .shadow Mi Texto');
      }

      await message.reply('⏳ Generando logo sombrío... espera');

      const prompt = `shadow logo with text "${text}", dark mysterious style, black and grey colors, dramatic lighting, professional design, high quality`;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

      const response = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 60000 });

      const tempDir = path.join(__dirname, '../../temp');
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

      const imgPath = path.join(tempDir, `shadow_${Date.now()}.png`);
      fs.writeFileSync(imgPath, response.data);

      const media = MessageMedia.fromFilePath(imgPath);
      await message.reply(media, undefined, { caption: `🌑 SHADOW: ${text}` });

      setTimeout(() => { if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath); }, 5000);
    } catch (error) {
      console.error('Error en shadow:', error.message);
      message.reply('Error al generar el logo.');
    }
  }
};