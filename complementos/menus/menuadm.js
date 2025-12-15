const path = require('path');
const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
	nome: "menuadm",
	desc: "Menú de administrador",
	run: async (client, msg, args) => {
		try {
			const user = (msg.author || msg.from).split('@')[0];
			const prefix = global.config.prefix || ".";
			const menu = `
╭━━⪩ MENÚ ADMINISTRADOR ⪨━━
▢ • Bot: *Nagui*
▢ • Usuario: @${user}
▢ • Creador: *${global.criador}*
▢ • Versión: *1.0*
╰━━─「💜」─━━

╭━━⪩ COMANDOS ADMIN ⪨━━
▢ • ${prefix}Marcar
▢ • ${prefix}Ban <@usuario>
▢ • ${prefix}Kick <@usuario>
▢ • ${prefix}Silenciar <@usuario>
▢ • ${prefix}Dessilenciar <@usuario>
▢ • ${prefix}Advertir <@usuario>
▢ • ${prefix}Abrir
▢ • ${prefix}Cerrar
▢ • ${prefix}Linkgp
▢ • ${prefix}Resetlink
▢ • ${prefix}Promover <@usuario>
▢ • ${prefix}Rebaixar <@usuario>
▢ • ${prefix}Tagall <mensaje>
▢ • ${prefix}Warn <@usuario> <razón>
▢ • ${prefix}Welcome on/off <mensaje>
▢ • ${prefix}Goodbye on/off <mensaje>
▢ • ${prefix}Antispam on/off
▢ • ${prefix}Detectarbots on/off

╭━━⪩ SEGURIDAD DEL GRUPO ⪨━━
▢ • ${prefix}Antispamstickers on/off
  └─ 🚫 >100 stickers = silencia 24h
▢ • ${prefix}Antilink on/off
  └─ 🔗 Elimina todos los links
▢ • ${prefix}Anti18 on/off
  └─ 🔞 Detecta contenido explícito
▢ • ${prefix}Antistickers18 on/off
  └─ 🎨 Elimina stickers 18+
▢ • ${prefix}Avisosinactivos on/off
  └─ 👻 Menciona usuario inactivo
╰━━─「💜」─━━
`;
			const jid = msg.from;
			// Usar la foto específica del menú de administrador
			let fotomenu = global.fotos.fotomenuadm;
			if (!fotomenu) {
				// Fallback a la imagen general
				fotomenu = global.fotos.videomenu || global.fotos.fotomenu;
				if (!fotomenu) {
					// Buscar la primera imagen disponible en fotos.json
					const posibles = Object.values(global.fotos).filter(f => /\.(jpg|jpeg|png|gif|webp|mp4|webm|mov)$/i.test(f));
					fotomenu = posibles[0];
				}
			}
			const isLocal = !/^https?:\/\//i.test(fotomenu);
			const ext = fotomenu.split('.').pop().toLowerCase();
			const isVideo = ['mp4', 'webm', 'mov'].includes(ext);
			// Enviar imagen/video del menú con mejor manejo de errores
			try {
				let media;
				let mediaLoaded = false;

				if (isLocal) {
					// Para archivos locales, usar fromFilePath
					const filePath = path.join(__dirname, '../../', fotomenu);
					console.log('Intentando cargar archivo local:', filePath);

					// Verificar que el archivo existe
					if (fs.existsSync(filePath)) {
						const stats = fs.statSync(filePath);
						console.log('Archivo encontrado, tamaño:', stats.size, 'bytes');

						// Intentar cargar la media
						try {
							media = await MessageMedia.fromFilePath(filePath);
							mediaLoaded = true;
							console.log('Media cargada exitosamente desde archivo local');
						} catch (mediaError) {
							console.error('Error cargando media:', mediaError.message);
							// Intentar con imagen alternativa
							const fallbackPath = path.join(__dirname, '../../src/img/profilebot.png');
							if (fs.existsSync(fallbackPath)) {
								console.log('Intentando fallback con imagen...');
								media = await MessageMedia.fromFilePath(fallbackPath);
								mediaLoaded = true;
							}
						}
					} else {
						console.log('Archivo no encontrado, usando fallback');
						const fallbackPath = path.join(__dirname, '../../src/img/profilebot.png');
						if (fs.existsSync(fallbackPath)) {
							media = await MessageMedia.fromFilePath(fallbackPath);
							mediaLoaded = true;
						}
					}
				}

				// Intentar enviar con media si se cargó correctamente
				if (mediaLoaded && media) {
					try {
						// Pequeño delay para asegurar estabilidad
						await new Promise(resolve => setTimeout(resolve, 500));
						await client.sendMessage(jid, media, { caption: menu });
						console.log('Mensaje con media enviado exitosamente');
					} catch (sendError) {
						console.error('Error enviando media, enviando solo texto:', sendError.message);
						await client.sendMessage(jid, menu);
					}
				} else {
					// Enviar solo texto si no hay media
					console.log('Enviando menú sin media');
					await client.sendMessage(jid, menu);
				}
			} catch (error) {
				console.error('Error general en menú:', error.message);
				// Fallback final: enviar solo texto
				await client.sendMessage(jid, menu);
			}
		} catch (error) {
			console.error(error);
			msg.reply('Error al mostrar el menú de admin.');
		}
	}
};