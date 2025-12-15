const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
  nome: 'tiktokmp3',
  desc: 'Descarga audio de TikTok',
  run: async (client, msg, args) => {
    try {
      const url = args.join(' ');
      if (!url || !url.includes('tiktok.com')) {
        return client.sendMessage(msg.from, 'Por favor, proporciona una URL válida de TikTok.');
      }

      // Enviar mensaje de detección inicial
      await client.sendMessage(msg.from, '🎵 Audio de TikTok detectado. Descargando...');

      const tempDir = path.join(__dirname, '../../temp');
      await fs.ensureDir(tempDir);
      const outputPath = path.join(tempDir, `tiktokmp3_${Date.now()}.mp3`);
      const ffmpegPath = path.resolve(__dirname, '../../ffmpeg/ffmpeg-8.0.1-essentials_build/bin/ffmpeg.exe').replace(/\\/g, '/');

      // Descargar el audio usando yt-dlp
      const command = `"${path.resolve(__dirname, '../../bin/yt-dlp.exe').replace(/\\/g, '/')}" -f bestaudio --extract-audio --audio-format mp3 --ffmpeg-location "${ffmpegPath}" -o "${outputPath.replace(/\\/g, '/')}" --extractor-args "tiktok:api" "${url}"`;
      await new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            reject(stderr || stdout || error);
          } else {
            resolve();
          }
        });
      });

      // Verificar el archivo
      if (!fs.existsSync(outputPath) || fs.statSync(outputPath).size === 0) {
        throw new Error('El contenido solicitado no está disponible para descarga.');
      }
      const media = await MessageMedia.fromFilePath(outputPath);
      if (!media.mimetype.startsWith('audio/')) {
        throw new Error('El archivo descargado no es un audio válido.');
      }

      // Enviar mensaje con mención
      await client.sendMessage(msg.from, `🎶 Aquí tienes tu audio de TikTok @${(msg.author || msg.from).split('@')[0]}`);

      // Enviar el audio
      await client.sendMessage(msg.from, media, {
        sendAudioAsVoice: false
      });

      // Limpiar archivo temporal
      await fs.remove(outputPath);
    } catch (error) {
      console.error(error);
      try {
        await client.sendMessage(msg.from, 'El contenido solicitado no está disponible para descarga.');
      } catch (sendError) {
        console.error('Error enviando mensaje de error:', sendError);
      }
    }
  }
};