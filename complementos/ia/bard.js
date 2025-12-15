const axios = require('axios');
const { generateSmartResponse } = require('./ia.js');

module.exports = {
  nome: 'bard',
  nomes: ['bard', 'google', 'bard-ai'],
  run: async (client, msg, args) => {
    const from = msg.from;
    const query = args.join(' ').trim();

    if (!query) {
      return client.sendMessage(from, '🔍 *Uso:* !bard <pregunta>\n\nEjemplo: !bard ¿Cómo funciona la fotosíntesis?');
    }

    try {
      await client.sendMessage(from, '🤔 _Bard está procesando..._');

      // Usar respuesta inteligente
      const fallbackResponse = generateBardResponse(query);
      client.sendMessage(from, `🤖 *Bard:*\n\n${fallbackResponse}`);

    } catch (error) {
      console.error('❌ Error en Bard:', error.message);
      client.sendMessage(from, '❌ Error procesando tu pregunta.');
    }
  }
};

function generateBardResponse(query) {
  const lower = query.toLowerCase().trim();
  
  // Saludos
  if (/^(hola|hey|buenos|hi)/.test(lower)) {
    return '¡Hola! 👋 Soy Bard, asistente de Google. ¿Cómo te puedo ayudar?';
  }

  // Ciencia
  if (/fotosintesis|fotosíntesis/.test(lower)) {
    return 'La fotosíntesis es el proceso mediante el cual las plantas convierten la luz solar en energía química (glucosa) y oxígeno. Ocurre principalmente en las hojas en los cloroplastos.';
  }
  if (/agua|h2o|molécula/.test(lower)) {
    return 'El agua (H₂O) es esencial para toda la vida. Cubre el 71% de la Tierra. Una molécula de agua está compuesta por 2 átomos de hidrógeno y 1 de oxígeno.';
  }
  if (/energia|ley de la termodinámica|trabajo/.test(lower)) {
    return 'La energía es la capacidad de realizar trabajo o causar cambios. Existen múltiples formas:\n• Térmica\n• Cinética\n• Potencial\n• Eléctrica\n• Nuclear';
  }
  if (/ecosistema|biodiversidad|cadena alimenticia/.test(lower)) {
    return 'Un ecosistema es una comunidad de organismos vivos interactuando con su ambiente físico. Incluye productores (plantas), consumidores (animales) y descomponedores (bacterias).';
  }

  // Respuesta por defecto
  return 'Esa es una pregunta interesante. Aunque estoy en modo limitado, puedo darte información general. ¿Hay algo más específico?';
}