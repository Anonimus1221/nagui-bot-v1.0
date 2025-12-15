const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
  nome: 'blackpink',
  desc: 'Crear logo Blackpink con IA',
  run: async (client, msg, args) => {
    try {
      const text = args.filter(a => a.trim()).join(' ').trim();
      if (!text || text.length === 0) {
        return msg.reply('🎀 Por favor, proporciona un texto para el logo.\n\nEjemplo: .blackpink Mi Texto');
      }

      await msg.reply('⏳ Generando logo blackpink... espera');

      const prompt = `blackpink kpop logo with text "${text}", pink black gold colors, stylish modern design, sparkles, professional design, high quality`;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

      const response = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 60000 });

      const tempDir = path.join(__dirname, '../../temp');
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

      const imgPath = path.join(tempDir, `blackpink_${Date.now()}.png`);
      fs.writeFileSync(imgPath, response.data);

      const media = MessageMedia.fromFilePath(imgPath);
      await msg.reply(media, undefined, { caption: `🎀 BLACKPINK: ${text}` });

      setTimeout(() => { if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath); }, 5000);
    } catch (error) {
      console.error(error);
      msg.reply('Error al crear el logo.');
    }
  }
};