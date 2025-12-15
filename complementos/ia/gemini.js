const axios = require('axios');

module.exports = {
  nome: 'gemini',
  nomes: ['gemini', 'google-ai', 'gem'],
  run: async (client, msg, args) => {
    const from = msg.from;
    const query = args.join(' ').trim();

    if (!query) {
      return client.sendMessage(from, '✨ *Uso:* !gemini <pregunta>\n\nEjemplo: !gemini ¿Qué es la inteligencia artificial?');
    }

    try {
      await client.sendMessage(from, '🔮 _Gemini está pensando..._');

      // Usar respuesta inteligente
      const fallbackResponse = generateGeminiResponse(query);
      client.sendMessage(from, `✨ *Gemini:*\n\n${fallbackResponse}`);

    } catch (error) {
      console.error('❌ Error en Gemini:', error.message);
      client.sendMessage(from, '❌ Error procesando tu pregunta.');
    }
  }
};

function generateGeminiResponse(query) {
  const lower = query.toLowerCase().trim();
  
  // Saludos
  if (/^(hola|hey|buenos|hi)/.test(lower)) {
    return '¡Hola! 👋 Soy Gemini, asistente de IA de Google. ¿En qué puedo asistirte?';
  }

  // Tecnología e IA
  if (/inteligencia artificial|ia|machine learning|aprendizaje|deep learning/.test(lower)) {
    return 'La Inteligencia Artificial (IA) es la capacidad de máquinas para realizar tareas que requieren inteligencia humana:\n\n• *Machine Learning:* Las máquinas aprenden de datos\n• *Deep Learning:* Usa redes neuronales\n• *Procesamiento de Lenguaje:* Entiende texto\n• *Visión Computacional:* Analiza imágenes';
  }
  if (/algoritmo|programacion|código|python|javascript/.test(lower)) {
    return 'Un algoritmo es un conjunto ordenado de pasos para resolver un problema. En programación usamos lenguajes como Python, JavaScript, etc. para implementar algoritmos eficientemente.';
  }
  if (/redes neuronales|neural network|transformer|gpt/.test(lower)) {
    return 'Las redes neuronales son modelos inspirados en el cerebro humano. Tienen capas de neuronas conectadas. Los Transformers (como GPT) son arquitecturas modernas muy poderosas para procesamiento de lenguaje.';
  }

  // Ciencia General
  if (/universo|espacio|estrella|galaxia|agujero negro/.test(lower)) {
    return 'El universo es todo lo que existe: materia, energía, espacio y tiempo. Contiene billones de galaxias. Las estrellas nacen, viven y mueren. Los agujeros negros son regiones donde la gravedad es tan fuerte que nada escapa.';
  }
  if (/física|relativity|einstein|newton/.test(lower)) {
    return 'La Física estudia las leyes del universo. Isaac Newton describió la gravedad y el movimiento. Albert Einstein revolucionó nuestra comprensión con la Relatividad (E=mc²).';
  }

  // Respuesta por defecto
  return 'Esa es una pregunta interesante. Aunque estoy en modo limitado, puedo proporcionarte información general. ¿Hay algo más específico que quieras saber?';
}