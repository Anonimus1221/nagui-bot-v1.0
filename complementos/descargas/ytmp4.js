const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
  nome: 'ytmp4',
  desc: 'Descarga videos de YouTube en MP4 usando yt-dlp y ffmpeg local',
  run: async (client, msg, args) => {
    try {
      const url = args.join(' ');
      if (!url || !url.includes('youtube.com') && !url.includes('youtu.be')) {
        return client.sendMessage(msg.from, { text: 'Por favor, proporciona una URL válida de YouTube.' });
      }

      // Enviar mensaje de detección inicial
      await client.sendMessage(msg.from, '🎥 Video de YouTube detectado. Descargando...');

      const tempDir = path.join(__dirname, '../../temp');
      await fs.ensureDir(tempDir);
      const outputPath = path.join(tempDir, `ytmp4_${Date.now()}.mp4`);
      const ffmpegPath = path.resolve(__dirname, '../../ffmpeg/ffmpeg-8.0.1-essentials_build/bin/ffmpeg.exe');

      // Descargar el video usando yt-dlp y convertir con ffmpeg local
      const command = `"${path.resolve(__dirname, '../../bin/yt-dlp.exe')}" -f mp4 --ffmpeg-location "${ffmpegPath}" -o "${outputPath.replace(/\\/g, '/')}" "${url}" --geo-bypass`;
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
        throw new Error('El archivo MP4 no se descargó correctamente.');
      }
      const media = await MessageMedia.fromFilePath(outputPath);
      if (!media.mimetype.startsWith('video/')) {
        throw new Error('El archivo descargado no es un video válido.');
      }

      // Enviar mensaje con mención
      await client.sendMessage(msg.from, `🎬 Aquí tienes tu video de YouTube @${(msg.author || msg.from).split('@')[0]}`);

      // Enviar el video
      await client.sendMessage(msg.from, media);

      // Limpiar archivo temporal
      await fs.remove(outputPath);
    } catch (error) {
      console.error(error);
      try {
        await client.sendMessage(msg.from, 'Error al descargar el video de YouTube.');
      } catch (sendError) {
        console.error('Error enviando mensaje de error:', sendError);
      }
    }
  }
};
