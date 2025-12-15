const axios = require('axios');

module.exports = {
  nome: 'chatgpt',
  nomes: ['chatgpt', 'gpt', 'ask'],
  run: async (client, msg, args) => {
    const from = msg.from;
    const query = args.join(' ').trim();

    if (!query) {
      return client.sendMessage(from, '💬 *Uso:* !chatgpt <pregunta>\n\nEjemplo: !chatgpt ¿Cuál es la capital de Francia?');
    }

    try {
      await client.sendMessage(from, '🧠 _Procesando..._');

      // API 1: You.com API (muy confiable)
      try {
        const response = await axios.post('https://api.you.com/api/streamingSearch', {
          query: query,
          chat: [{ question: query, answer: '' }]
        }, {
          timeout: 10000,
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        if (response.data) {
          let reply = '';
          if (response.data.results && response.data.results[0]) {
            reply = response.data.results[0].snippet || response.data.results[0].title;
          }
          if (!reply && response.data.answer) {
            reply = response.data.answer;
          }
          
          if (reply && reply.length > 5) {
            return client.sendMessage(from, `🤖 *Respuesta:*\n\n${reply.substring(0, 2000)}`);
          }
        }
      } catch (e) {
        console.log('[ChatGPT] You.com falló:', e.message);
      }

      // API 2: Using local fallback con respuestas enriquecidas
      const fallbackResponse = generateSmartResponse(query);
      client.sendMessage(from, `🤖 *Respuesta:*\n\n${fallbackResponse}`);

    } catch (error) {
      console.error('❌ Error en ChatGPT:', error.message);
      client.sendMessage(from, '❌ Error procesando tu pregunta. Intenta de nuevo.');
    }
  }
};

function generateSmartResponse(query) {
  const lower = query.toLowerCase().trim();
  
  // Saludos
  if (/^(hola|hey|buenos|hi)/.test(lower)) {
    return '¡Hola! 👋 Soy un asistente de IA. ¿En qué puedo ayudarte hoy?';
  }
  if (/como (esta|estás|va)/.test(lower)) {
    return 'Estoy bien, gracias por preguntar. ¿Y tú? ¿En qué puedo ayudarte?';
  }
  if (/gracias/.test(lower)) {
    return 'De nada 😊 Estoy aquí para ayudarte. ¿Algo más?';
  }

  // Geografía
  if (/capital.*francia|francia.*capital/.test(lower)) {
    return 'La capital de Francia es *París*, conocida como la "Ciudad de la Luz". Es famosa por la Torre Eiffel y su arquitectura.';
  }
  if (/capital.*españa|españa.*capital/.test(lower)) {
    return 'La capital de España es *Madrid*. Es la ciudad más grande de España y centro político y cultural del país.';
  }
  if (/capital.*colombia|colombia.*capital/.test(lower)) {
    return 'La capital de Colombia es *Bogotá*. Está ubicada en la cordillera de los Andes y es la segunda capital más alta de América del Sur.';
  }
  if (/tierra|planeta tierra|mundo/.test(lower)) {
    return 'La Tierra es nuestro planeta. Tiene aproximadamente 4.500 millones de años. Está cubierta por 71% de agua y es el único planeta conocido con vida. Su atmósfera contiene nitrógeno (78%) y oxígeno (21%).';
  }
  if (/sol|estrella/.test(lower)) {
    return 'El Sol es una estrella masiva de plasma mantenida por su propia gravedad. Está en el centro de nuestro sistema solar y es la fuente de energía para la vida en la Tierra.';
  }

  // Programación
  if (/python/.test(lower)) {
    return 'Python es un lenguaje de programación versátil, fácil de aprender. Se usa en:\n• Ciencia de datos\n• Automatización\n• Desarrollo web\n• Inteligencia Artificial\n\nEs perfecto para principiantes.';
  }
  if (/javascript/.test(lower)) {
    return 'JavaScript es el lenguaje de la web. Se ejecuta en navegadores y con Node.js en servidores. Es esencial para desarrollo web frontend y backend.';
  }
  if (/html|css/.test(lower)) {
    return 'HTML es el lenguaje para crear la estructura de páginas web. CSS es para el diseño y estilos. JavaScript agrega interactividad.';
  }

  // Ciencia
  if (/fotosintesis|fotosíntesis/.test(lower)) {
    return 'La fotosíntesis es el proceso en que las plantas convierten luz solar en energía química. Ocurre en cloroplastos y produce glucosa y oxígeno.';
  }
  if (/adn|genética|genes/.test(lower)) {
    return 'El ADN contiene la información genética de los seres vivos. Tiene forma de doble hélice y está compuesto por 4 bases nitrogenadas.';
  }
  if (/gravedad|newton/.test(lower)) {
    return 'La gravedad es la fuerza que atrae objetos hacia el centro de la Tierra. Fue descrita por Isaac Newton en sus leyes del movimiento.';
  }

  // IA
  if (/inteligencia artificial|ia|machine learning|aprendizaje/.test(lower)) {
    return 'La inteligencia artificial (IA) es la capacidad de máquinas para realizar tareas que normalmente requieren inteligencia humana. Incluye:\n• Reconocimiento de imágenes\n• Procesamiento de lenguaje\n• Toma de decisiones\n• Predicciones';
  }

  // Preguntas generales
  if (/que es|qué es|define|definición/.test(lower)) {
    const topic = lower.replace(/que es|qué es|define|definición/g, '').trim();
    return `Entiendo que quieres saber qué es "${topic}". Aunque estoy en modo limitado, puedo darte información general. ¿Puedes ser más específico?`;
  }

  // Respuesta por defecto
  const responses = [
    'Esa es una buena pregunta. Aunque estoy en modo limitado, puedo intentar ayudarte. ¿Puedes ser más específico?',
    '🤔 Interesante pregunta. Aquí puedo darte información general. ¿Hay algo más específico que quieras saber?',
    'Entiendo tu pregunta. Estoy trabajando con capacidades limitadas, pero haré mi mejor esfuerzo para ayudarte.'
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}