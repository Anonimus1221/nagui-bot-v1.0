const path = require('path');
const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
	nome: "menudono",
	desc: "Menú del creador",
	run: async (client, msg, args) => {
		try {
			const user = (msg.author || msg.from).split('@')[0];
			const prefix = global.config.prefix || ".";
			// Solo permitir al dueño
			const ownerNumber = (global.config.criadorNumber || '').replace(/[^0-9]/g, '');
			const sender = msg.author || msg.from;
			const senderNumber = sender.replace(/[^0-9]/g, '');
			if (!ownerNumber || ownerNumber !== senderNumber) {
				return msg.reply('Solo el creador puede usar este menú.');
			}
			const menu = `
╭━━⪩ MENÚ DEL CREADOR ⪨━━
▢ • Bot: *Nagui*
▢ • Usuario: @${user}
▢ • Creador: *${global.criador}*
▢ • Versión: *1.0*
╰━━─「💜」─━━

╭━━⪩ COMANDOS DEL CREADOR ⪨━━
▢ • ${prefix}Fotomenu <imagen>
▢ • ${prefix}Setprefix <nuevo>
▢ • ${prefix}Setapikey <nueva>
▢ • ${prefix}Setnombrebot <nombre>
▢ • ${prefix}Setnomedono <nombre>
▢ • ${prefix}Setnumerodono <numero>
▢ • ${prefix}Blockcmd <comando>
▢ • ${prefix}Unblockcmd <comando>
▢ • ${prefix}Blockuser @usuario
▢ • ${prefix}Unblockuser @usuario
▢ • ${prefix}Addcomandodono <comando>
▢ • ${prefix}Delcomandodono <comando>
▢ • ${prefix}Downloads <archivo>
▢ • ${prefix}Subbot
▢ • ${prefix}ExpulsarSubbots
▢ • ${prefix}PromoverTodos
╰━━─「💜」─━━
`;
			const jid = msg.from;
			// Usar la foto específica del menú del creador
			let fotomenu = global.fotos.fotomenudono;
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
			msg.reply('Error al mostrar el menú del creador.');
		}
	}
};