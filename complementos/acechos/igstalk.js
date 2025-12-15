const axios = require('axios');

module.exports = {
  nome: 'igstalk',
  desc: 'Obtiene información de un usuario de Instagram',
  run: async (client, message, args) => {
    try {
      const username = args[0];
      if (!username) {
        return await message.reply('❌ Proporciona un nombre de usuario de Instagram.\n\nEjemplo: .igstalk cristiano');
      }

      await message.reply('⏳ Buscando información de Instagram... espera un momento');

      const cleanUsername = username.replace('@', '').toLowerCase();
      
      try {
        // API 1: Usar instant-instagram (funciona muy bien)
        const response = await axios.get('https://i.instagram.com/api/v1/users/web_profile_info/', {
          params: { username: cleanUsername },
          headers: {
            'User-Agent': 'Instagram 162.0.0.52.123 Android',
            'X-Requested-With': 'XMLHttpRequest'
          },
          timeout: 15000
        });

        if (response.data?.data?.user) {
          const user = response.data.data.user;
          const followers = user.edge_followed_by?.count || 0;
          const following = user.edge_follow?.count || 0;
          const posts = user.edge_owner_to_timeline_media?.count || 0;
          
          const info = `
📸 *Instagram Stalk - @${cleanUsername}*

👤 *Nombre:* ${user.full_name || cleanUsername}
📝 *Bio:* ${user.biography || '_Sin biografía_'}
✅ *Verificado:* ${user.is_verified ? '✔️ Sí' : '❌ No'}
🔒 *Privado:* ${user.is_private ? '🔐 Sí' : '🌐 No'}

📊 *Estadísticas:*
👥 Seguidores: *${followers.toLocaleString()}*
📺 Siguiendo: *${following.toLocaleString()}*
📷 Posts: *${posts.toLocaleString()}*

🔗 *Perfil:* https://www.instagram.com/${cleanUsername}/
`;
          await message.reply(info);
          return;
        }
      } catch (error1) {
        console.log('API 1 falló, intentando API 2...');
      }

      // API 2: Alternativa con scraper
      try {
        const response2 = await axios.get(`https://www.instagram.com/api/v1/users/web_profile_info/`, {
          params: { username: cleanUsername },
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json'
          },
          timeout: 15000
        });

        if (response2.data?.data?.user) {
          const user = response2.data.data.user;
          const followers = user.edge_followed_by?.count || 0;
          const following = user.edge_follow?.count || 0;
          const posts = user.edge_owner_to_timeline_media?.count || 0;
          
          const info = `
📸 *Instagram Stalk - @${cleanUsername}*

👤 *Nombre:* ${user.full_name || cleanUsername}
📝 *Bio:* ${user.biography || '_Sin biografía_'}
✅ *Verificado:* ${user.is_verified ? '✔️ Sí' : '❌ No'}
🔒 *Privado:* ${user.is_private ? '🔐 Sí' : '🌐 No'}

📊 *Estadísticas:*
👥 Seguidores: *${followers.toLocaleString()}*
📺 Siguiendo: *${following.toLocaleString()}*
📷 Posts: *${posts.toLocaleString()}*

🔗 *Perfil:* https://www.instagram.com/${cleanUsername}/
`;
          await message.reply(info);
          return;
        }
      } catch (error2) {
        console.log('API 2 falló, intentando API 3...');
      }

      // API 3: Usar RapidAPI como último recurso
      try {
        const response3 = await axios.get('https://instagram-scraper-api2.p.rapidapi.com/v1/info', {
          params: { username: cleanUsername },
          headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY || 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
            'x-rapidapi-host': 'instagram-scraper-api2.p.rapidapi.com'
          },
          timeout: 15000
        });

        if (response3.data?.data) {
          const user = response3.data.data;
          const followers = user.followers || 0;
          const following = user.following || 0;
          const posts = user.media_count || 0;
          
          const info = `
📸 *Instagram Stalk - @${cleanUsername}*

👤 *Nombre:* ${user.full_name || cleanUsername}
📝 *Bio:* ${user.biography || '_Sin biografía_'}
✅ *Verificado:* ${user.is_verified ? '✔️ Sí' : '❌ No'}
🔒 *Privado:* ${user.is_private ? '🔐 Sí' : '🌐 No'}

📊 *Estadísticas:*
👥 Seguidores: *${followers.toLocaleString()}*
📺 Siguiendo: *${following.toLocaleString()}*
📷 Posts: *${posts.toLocaleString()}*

🔗 *Perfil:* https://www.instagram.com/${cleanUsername}/
`;
          await message.reply(info);
          return;
        }
      } catch (error3) {
        console.log('API 3 falló');
      }

      // Fallback: Si todas las APIs fallan
      const fallbackText = `
📸 *Instagram Stalk - @${cleanUsername}*

⚠️ No se pudo acceder a los datos en este momento.

💡 *Posibles razones:*
• El perfil es completamente privado
• El usuario no existe
• Instagram bloqueó la solicitud (límite de requests)

🔗 *Abre directamente:*
https://www.instagram.com/${cleanUsername}/

💡 *Intenta con otro usuario o más tarde*`;
      await message.reply(fallbackText);

    } catch (error) {
      console.error('Error en igstalk:', error.message);
      await message.reply('❌ Error al procesar comando de Instagram. Intenta de nuevo.');
    }
  }
};