const axios = require('axios');

module.exports = {
  nome: 'sora1',
  nomes: ['sora1', 'sora', 'videoia'],
  run: async (client, msg, args) => {
    const from = msg.from;
    const prompt = args.join(' ').trim();

    if (!prompt) {
      return client.sendMessage(from, '🎬 *Uso:* !sora1 <descripción>\n\nEjemplo: !sora1 un gato corriendo en la playa');
    }

    try {
      await client.sendMessage(from, '🎥 _Sora está generando tu video..._\n_Esto puede tomar unos momentos..._');

      // Intentar con API disponible
      try {
        const response = await axios.get(
          `https://mayapi.ooguy.com/ai-sora?q=${encodeURIComponent(prompt)}&apikey=may-f53d1d49`,
          { timeout: 60000 }
        );

        if (response.data && response.data.video) {
          try {
            await client.sendMessage(from, {
              video: { url: response.data.video },
              caption: `✨ *Video Sora generado:*\n\n📝 Prompt: ${prompt}\n\n_Generado por IA_`
            });
            return;
          } catch (videoError) {
            console.log('Error enviando video:', videoError.message);
          }
        }
      } catch (e) {
        console.log('API Sora falló');
      }

      // Fallback: informar que la función está limitada
      client.sendMessage(from, '⚠️ La generación de videos tiene limitaciones técnicas.\n\nIntenta con !ia o !chatgpt en su lugar.');

    } catch (error) {
      console.error('❌ Error en Sora:', error.message);
      client.sendMessage(from, '❌ No pude generar el video. Intenta más tarde.');
    }
  }
};