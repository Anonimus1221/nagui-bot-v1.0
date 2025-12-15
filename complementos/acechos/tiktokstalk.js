const axios = require('axios');

module.exports = {
  nome: 'tiktokstalk',
  desc: 'Obtiene información de un usuario de TikTok',
  run: async (client, message, args) => {
    try {
      const username = args[0];
      if (!username) {
        return await message.reply('❌ Proporciona un nombre de usuario de TikTok.\n\nEjemplo: .tiktokstalk cristiano');
      }

      await message.reply('⏳ Buscando información de TikTok... espera un momento');

      const cleanUsername = username.replace('@', '').toLowerCase();
      
      try {
        // API 1: TikTok Scraper
        const response = await axios.get('https://api.tiktok.com/v1/user/search/', {
          params: { keywords: cleanUsername, count: 1 },
          headers: {
            'User-Agent': 'TikTok 18.0.0 (Linux; Android 10)',
            'X-Requested-With': 'XMLHttpRequest'
          },
          timeout: 15000
        });

        if (response.data?.user_list && response.data.user_list.length > 0) {
          const user = response.data.user_list[0].user_info.user;
          const stats = response.data.user_list[0].user_info.statistics;
          
          const info = `
🎵 *TikTok Stalk - @${cleanUsername}*

👤 *Nombre:* ${user.nickname || cleanUsername}
📝 *Bio:* ${user.signature || '_Sin biografía_'}
✅ *Verificado:* ${user.verified ? '✔️ Sí' : '❌ No'}

📊 *Estadísticas:*
👥 Seguidores: *${(stats.follower_count || 0).toLocaleString()}*
📺 Siguiendo: *${(stats.following_count || 0).toLocaleString()}*
❤️ Me gusta: *${(stats.heart_count || 0).toLocaleString()}*
🎬 Videos: *${(stats.video_count || 0).toLocaleString()}*

🔗 *Perfil:* https://www.tiktok.com/@${cleanUsername}
`;
          await message.reply(info);
          return;
        }
      } catch (error1) {
        console.log('API 1 TikTok falló, intentando API 2...');
      }

      // API 2: Alternativa de scraper
      try {
        const response2 = await axios.get(`https://www.tiktok.com/@${cleanUsername}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          timeout: 15000
        });

        // Extraer datos del HTML
        const jsonMatch = response2.data.match(/__UNIVERSAL_DATA_FOR_REHYDRATION__=({.*?})</);
        if (jsonMatch) {
          try {
            const data = JSON.parse(jsonMatch[1]);
            const userDetail = data?.__DEFAULT_SCOPE__?.['webapp.user-detail']?.userInfo?.user;
            
            if (userDetail) {
              const stats = data?.__DEFAULT_SCOPE__?.['webapp.user-detail']?.userInfo?.stats;
              const info = `
🎵 *TikTok Stalk - @${cleanUsername}*

👤 *Nombre:* ${userDetail.nickname || cleanUsername}
📝 *Bio:* ${userDetail.signature || '_Sin biografía_'}
✅ *Verificado:* ${userDetail.verified ? '✔️ Sí' : '❌ No'}

📊 *Estadísticas:*
👥 Seguidores: *${(stats?.followerCount || 0).toLocaleString()}*
📺 Siguiendo: *${(stats?.followingCount || 0).toLocaleString()}*
❤️ Me gusta: *${(stats?.heartCount || 0).toLocaleString()}*
🎬 Videos: *${(stats?.videoCount || 0).toLocaleString()}*

🔗 *Perfil:* https://www.tiktok.com/@${cleanUsername}
`;
              await message.reply(info);
              return;
            }
          } catch (parseError) {
            console.log('Error al parsear respuesta');
          }
        }
      } catch (error2) {
        console.log('API 2 TikTok falló, intentando API 3...');
      }

      // API 3: RapidAPI como último recurso
      try {
        const response3 = await axios.get('https://tiktok-scraper3.p.rapidapi.com/user/info', {
          params: { uniqueId: cleanUsername },
          headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY || 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
            'x-rapidapi-host': 'tiktok-scraper3.p.rapidapi.com'
          },
          timeout: 15000
        });

        if (response3.data?.user) {
          const user = response3.data.user;
          const stats = response3.data.stats || {};
          
          const info = `
🎵 *TikTok Stalk - @${cleanUsername}*

👤 *Nombre:* ${user.nickname || cleanUsername}
📝 *Bio:* ${user.signature || '_Sin biografía_'}
✅ *Verificado:* ${user.verified ? '✔️ Sí' : '❌ No'}

📊 *Estadísticas:*
👥 Seguidores: *${(stats.followerCount || 0).toLocaleString()}*
📺 Siguiendo: *${(stats.followingCount || 0).toLocaleString()}*
❤️ Me gusta: *${(stats.heartCount || 0).toLocaleString()}*
🎬 Videos: *${(stats.videoCount || 0).toLocaleString()}*

🔗 *Perfil:* https://www.tiktok.com/@${cleanUsername}
`;
          await message.reply(info);
          return;
        }
      } catch (error3) {
        console.log('API 3 TikTok falló');
      }

      // Fallback: Si todas las APIs fallan
      const fallbackText = `
🎵 *TikTok Stalk - @${cleanUsername}*

⚠️ No se pudo acceder a los datos en este momento.

💡 *Posibles razones:*
• El usuario no existe
• El perfil está suspendido
• TikTok bloqueó la solicitud (límite de requests)

🔗 *Abre directamente:*
https://www.tiktok.com/@${cleanUsername}

💡 *Intenta con otro usuario o más tarde*`;
      await message.reply(fallbackText);

    } catch (error) {
      console.error('Error en tiktokstalk:', error.message);
      await message.reply('❌ Error al procesar comando de TikTok. Intenta de nuevo.');
    }
  }
};