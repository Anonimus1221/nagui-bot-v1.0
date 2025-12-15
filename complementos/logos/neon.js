const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
  nome: 'neon',
  desc: 'Genera un logo estilo neon con IA',
  run: async (client, msg, args) => {
    try {
      const text = args.filter(a => a.trim()).join(' ').trim();
      if (!text || text.length === 0) {
        await msg.reply('⚡ Por favor, proporciona un texto para el logo.\n\nEjemplo: .neon Mi Texto');
        return;
      }

      await msg.reply('⏳ Generando logo neon... espera un momento');

      const safeText = encodeURIComponent(text.substring(0, 30));
      const prompt = `neon logo with glowing text "${text}", bright electric blue neon lights, dark background, professional design, high quality, 4k`;
      
      // Usar Pollinations.ai - completamente gratis sin token
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

      const response = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 60000 });

      const tempDir = path.join(__dirname, '../../temp');
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

      const imgPath = path.join(tempDir, `neon_${Date.now()}.png`);
      fs.writeFileSync(imgPath, response.data);

      const media = MessageMedia.fromFilePath(imgPath);
      await msg.reply(media, undefined, { caption: `⚡ NEON: ${text}` });

      setTimeout(() => { if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath); }, 5000);
    } catch (error) {
      console.error('Error en neon:', error.message);
      await msg.reply('❌ Error al generar el logo neon. Intenta de nuevo.');
    }
  }
};