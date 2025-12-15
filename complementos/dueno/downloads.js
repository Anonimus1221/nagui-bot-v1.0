const fs = require('fs-extra');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
  nome: 'downloads',
  desc: 'Descarga archivos del bot (solo para el dueño)',
  run: async (client, msg, args) => {
    try {
      const sender = msg.author || msg.from;
      const ownerNumber = (global.config.criadorNumber || '').replace(/[^0-9]/g, '');
      const senderNumber = sender.replace(/[^0-9]/g, '');
      const isOwner = ownerNumber && senderNumber && ownerNumber === senderNumber;

      if (!isOwner) {
        return await msg.reply('❌ Solo el dueño puede usar este comando.');
      }

      const fileName = args[0];
      if (!fileName) {
        return await msg.reply('⚠️ Uso: !downloads <archivo>\nEjemplo: !downloads config.json');
      }

      // Rutas seguras
      const allowedDirs = [
        path.join(__dirname, '../../configuracion'),
        path.join(__dirname, '../../data'),
        path.join(__dirname, '../../')
      ];

      const filePath = path.normalize(path.join(__dirname, '../../', fileName));
      
      // Verificar que la ruta está dentro de las permitidas
      const isAllowed = allowedDirs.some(dir => filePath.startsWith(path.normalize(dir)));
      
      if (!isAllowed || !await fs.pathExists(filePath)) {
        return await msg.reply('❌ Archivo no encontrado o acceso denegado.');
      }

      try {
        const media = await MessageMedia.fromFilePath(filePath);
        await client.sendMessage(msg.from, media, { caption: `📄 ${fileName}` });
        console.log(`📥 Archivo descargado por dueño: ${fileName}`);
      } catch (e) {
        await msg.reply('❌ Error al enviar el archivo.');
      }
    } catch (error) {
      console.error('Error en downloads:', error);
      await msg.reply('❌ Error al descargar el archivo.');
    }
  }
};