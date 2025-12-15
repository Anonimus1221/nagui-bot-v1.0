const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
  nome: 'play',
  desc: 'Busca y descarga música de YouTube por nombre',
  run: async (client, msg, args) => {
    try {
      const query = args.join(' ');
      if (!query) {
        return client.sendMessage(msg.from, 'Por favor, proporciona el nombre de la canción.');
      }

      const tempDir = path.join(__dirname, '../../temp');
      await fs.ensureDir(tempDir);
      const outputPath = path.join(tempDir, `play_${Date.now()}.mp3`);
      const ffmpegPath = path.resolve(__dirname, '../../ffmpeg/ffmpeg-8.0.1-essentials_build/bin/ffmpeg.exe').replace(/\\/g, '/');

      // Enviar mensaje de detección inicial
      await client.sendMessage(msg.from, `🎵 Música detectada: ${query}. Descargando...`);

      // Buscar y descargar el audio usando yt-dlp
      const command = `"${path.resolve(__dirname, '../../bin/yt-dlp.exe').replace(/\\/g, '/')}" "ytsearch1:${query}" --extract-audio --audio-format mp3 --ffmpeg-location "${ffmpegPath}" -o "${outputPath.replace(/\\/g, '/')}" --no-playlist --ignore-errors --no-warnings`;
      await new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            reject(stderr || stdout || error);
          } else {
            resolve();
          }
        });
      });

      // Esperar un poco para que el archivo se escriba completamente
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Enviar el audio
      if (!fs.existsSync(outputPath)) {
        throw new Error('El archivo de audio no se encontró.');
      }

      const fileSize = fs.statSync(outputPath).size;
      await client.sendMessage(msg.from, `Tamaño del archivo: ${fileSize} bytes`);

      const media = await MessageMedia.fromFilePath(outputPath);

      // Enviar mensaje con mención y entrega
      await client.sendMessage(msg.from, `🎶 Aquí tienes tu canción: ${query} @${(msg.author || msg.from).split('@')[0]}`);

      await client.sendMessage(msg.from, media);

      await client.sendMessage(msg.from, 'Audio enviado.');

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