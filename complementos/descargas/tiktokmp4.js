const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
  nome: 'tiktokmp4',
  desc: 'Descarga videos de TikTok',
  run: async (client, message, args) => {
    try {
      const url = args.join(' ');
      if (!url || !url.includes('tiktok.com')) {
        return message.reply('Por favor, proporciona una URL válida de TikTok.');
      }

      // Enviar mensaje de detección inicial
      await client.sendMessage(message.from, '🎥 Video de TikTok detectado. Descargando...');

      // Usar una API para descargar TikTok
      const apiUrl = `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`;
      const response = await axios.get(apiUrl);
      const videoUrl = response.data.video.noWatermark || response.data.video.watermark;

      // Descargar el video a un archivo temporal
      const tempDir = path.join(__dirname, '../../temp');
      await fs.ensureDir(tempDir);
      const outputPath = path.join(tempDir, `tiktok_${Date.now()}.mp4`);
      const videoResponse = await axios.get(videoUrl, { responseType: 'stream' });
      const writer = fs.createWriteStream(outputPath);
      videoResponse.data.pipe(writer);
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // Verificar el archivo
      if (!fs.existsSync(outputPath) || fs.statSync(outputPath).size === 0) {
        throw new Error('El archivo de TikTok no se descargó correctamente.');
      }
      const media = await MessageMedia.fromFilePath(outputPath);
      if (!media.mimetype.startsWith('video/')) {
        throw new Error('El archivo descargado no es un video válido.');
      }

      // Enviar mensaje con mención
      await client.sendMessage(message.from, `🎬 Aquí tienes tu video de TikTok @${(message.author || message.from).split('@')[0]}`);

      // Enviar el video
      await client.sendMessage(message.from, media);

      // Limpiar archivo temporal
      await fs.remove(outputPath);
    } catch (error) {
      console.error('Error en tiktokmp4:', error);
      try {
        await client.sendMessage(message.from, 'Error al descargar el video de TikTok. Verifica que la URL sea válida.');
      } catch (sendError) {
        console.error('Error enviando mensaje de error:', sendError);
      }
    }
  }
};