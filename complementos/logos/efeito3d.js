const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
  nome: 'efeito3d',
  desc: 'Genera un logo estilo 3D con IA',
  run: async (client, message, args) => {
    try {
      const text = args.filter(a => a.trim()).join(' ').trim();
      if (!text || text.length === 0) {
        return message.reply('🎯 Por favor, proporciona un texto para el logo.\n\nEjemplo: .efeito3d Mi Texto');
      }

      await message.reply('⏳ Generando logo 3D... espera');

      const prompt = `3D text logo with text "${text}", professional 3D rendering, glossy metallic surface, realistic shadows, modern design, high quality, 4k`;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

      const response = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 60000 });

      const tempDir = path.join(__dirname, '../../temp');
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

      const imgPath = path.join(tempDir, `efeito3d_${Date.now()}.png`);
      fs.writeFileSync(imgPath, response.data);

      const media = MessageMedia.fromFilePath(imgPath);
      await message.reply(media, undefined, { caption: `🎯 3D EFFECT: ${text}` });

      setTimeout(() => { if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath); }, 5000);
    } catch (error) {
      console.error('Error en efeito3d:', error.message);
      message.reply('Error al generar el logo 3D.');
    }
  }
};
