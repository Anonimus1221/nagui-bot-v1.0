const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
  nome: 'matrix',
  desc: 'Genera un logo estilo Matrix con IA',
  run: async (client, message, args) => {
    try {
      const text = args.filter(a => a.trim()).join(' ').trim();
      if (!text || text.length === 0) {
        return message.reply('🟢 Por favor, proporciona un texto para el logo.\n\nEjemplo: .matrix Mi Texto');
      }

      await message.reply('⏳ Generando logo matrix... espera');

      const prompt = `matrix code style logo with text "${text}", green glowing characters, binary code, dark background, cyberpunk, professional, high quality`;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

      const response = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 60000 });

      const tempDir = path.join(__dirname, '../../temp');
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

      const imgPath = path.join(tempDir, `matrix_${Date.now()}.png`);
      fs.writeFileSync(imgPath, response.data);

      const media = MessageMedia.fromFilePath(imgPath);
      await message.reply(media, undefined, { caption: `🟢 MATRIX: ${text}` });

      setTimeout(() => { if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath); }, 5000);
    } catch (error) {
      console.error('Error en matrix:', error.message);
      message.reply('Error al generar el logo.');
    }
  }
};