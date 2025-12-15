const axios = require('axios');

// Sistema de memoria por conversación
const conversationMemory = new Map();
const MAX_HISTORY = 6;
const MEMORY_TIMEOUT = 15 * 60 * 1000; // 15 minutos

// APIs GRATUITAS VERIFICADAS Y FUNCIONALES
const FREE_AI_APIS = [
  {
    name: 'GPT4Free',
    endpoint: 'https://gpt4free.io/api/chat',
    type: 'gpt4free',
    priority: 1
  },
  {
    name: 'Pollinations AI',
    endpoint: 'https://text.pollinations.ai',
    type: 'pollinations',
    priority: 2
  },
  {
    name: 'Nexra API',
    endpoint: 'https://nexra.aryahcr.cc/api/chat/complements',
    type: 'nexra',
    priority: 3
  },
  {
    name: 'AI Chat Free',
    endpoint: 'https://ai-chat-gpt-free.p.rapidapi.com/ask',
    type: 'aichat',
    priority: 4
  }
];

module.exports = {
  nome: 'ia',
  nomes: ['ai', 'chatgpt', 'gpt', 'bot', 'pregunta', 'nagui'],
  
  run: async (client, msg, args) => {
    const from = msg.from;
    const body = args.join(' ').trim();
    const userId = msg.author || from;

    if (!body) {
      return client.sendMessage(from, 
        '🤖 *NAGUI IA - Asistente Virtual Inteligente*\n\n' +
        '💬 *Puedo ayudarte con:*\n' +
        '• Responder cualquier pregunta\n' +
        '• Explicar temas complejos\n' +
        '• Ayuda con programación\n' +
        '• Consejos y recomendaciones\n' +
        '• Conversación natural\n' +
        '• Resolver problemas\n\n' +
        '📝 *Ejemplo:*\n' +
        '`!ia ¿cómo funciona la inteligencia artificial?`\n' +
        '`!ia ayúdame con un código en Python`\n' +
        '`!ia dame consejos para estudiar mejor`'
      );
    }

    // Indicador de escritura
    try {
      await client.sendMessage(from, '🧠 _Nagui está pensando..._');
    } catch (e) {}

    try {
      // Gestión de memoria conversacional
      let conversation = getOrCreateConversation(userId);
      
      // Construir contexto
      const context = buildContext(conversation.messages, body);
      
      // Intentar con APIs gratuitas funcionales
      let response = null;
      let usedAPI = null;

      // Probar cada API en orden
      for (const api of FREE_AI_APIS) {
        try {
          console.log(`[IA] Probando ${api.name}...`);
          response = await callFreeAI(api, body, context);
          
          if (response && response.length > 10) {
            usedAPI = api.name;
            console.log(`[IA] ✅ ${api.name} funcionó`);
            break;
          }
        } catch (err) {
          console.log(`[IA] ❌ ${api.name} falló: ${err.message}`);
          continue;
        }
      }

      // Si todas fallaron, usar IA local avanzada
      if (!response || response.length < 10) {
        console.log('[IA] Usando IA local como fallback');
        response = advancedLocalAI(body, conversation.messages);
        usedAPI = 'Local AI Enhanced';
      }

      // Limpiar respuesta
      response = cleanResponse(response);

      // Guardar en historial
      conversation.messages.push(
        { role: 'user', content: body },
        { role: 'assistant', content: response }
      );

      // Mantener límite de historial
      if (conversation.messages.length > MAX_HISTORY * 2) {
        conversation.messages = conversation.messages.slice(-MAX_HISTORY * 2);
      }

      conversation.lastActivity = Date.now();

      // Enviar respuesta con formato
      const finalResponse = formatResponse(response, usedAPI);
      await client.sendMessage(from, finalResponse);
      
      console.log(`[IA] ✅ Respuesta enviada | Usuario: ${userId.slice(0, 15)}... | API: ${usedAPI}`);

    } catch (error) {
      console.error('❌ Error crítico en IA:', error.message);
      const fallback = emergencyFallback(body);
      await client.sendMessage(from, fallback);
    }
  }
};

/**
 * Obtener o crear conversación
 */
function getOrCreateConversation(userId) {
  let conversation = conversationMemory.get(userId);
  
  if (!conversation) {
    conversation = {
      messages: [],
      lastActivity: Date.now(),
      messageCount: 0
    };
    conversationMemory.set(userId, conversation);
  }

  // Limpiar si expiró
  if (Date.now() - conversation.lastActivity > MEMORY_TIMEOUT) {
    conversation.messages = [];
  }

  conversation.messageCount++;
  return conversation;
}

/**
 * Construir contexto para la IA
 */
function buildContext(history, currentMessage) {
  const systemPrompt = `Eres Nagui, un asistente de IA inteligente y amigable para WhatsApp.

PERSONALIDAD:
- Hablas de forma natural y cercana
- Eres útil, preciso y directo
- Usas emojis ocasionalmente (sin abusar)
- Tienes buen sentido del humor

ESTILO:
- Respuestas concisas pero completas
- Usa *negritas* para énfasis importante
- Formato claro con saltos de línea
- Perfecto para WhatsApp (no muy largo)

CAPACIDADES:
- Responder cualquier pregunta con precisión
- Explicar conceptos de forma simple
- Ayudar con código, matemáticas, escritura
- Dar consejos útiles y prácticos
- Mantener conversaciones naturales`;

  let context = systemPrompt + '\n\n';
  
  // Agregar historial reciente
  if (history.length > 0) {
    context += 'CONVERSACIÓN PREVIA:\n';
    history.slice(-4).forEach(msg => {
      context += `${msg.role === 'user' ? 'Usuario' : 'Nagui'}: ${msg.content}\n`;
    });
    context += '\n';
  }
  
  context += `MENSAJE ACTUAL:\nUsuario: ${currentMessage}\n\nNagui:`;
  
  return context;
}

/**
 * Llamar a APIs de IA gratuitas
 */
async function callFreeAI(api, userMessage, context) {
  try {
    switch (api.type) {
      case 'gpt4free':
        return await callGPT4Free(api, userMessage);
      
      case 'pollinations':
        return await callPollinations(api, context);
      
      case 'nexra':
        return await callNexra(api, userMessage);
      
      case 'aichat':
        return await callAIChat(api, userMessage);
      
      default:
        throw new Error('API type not supported');
    }
  } catch (error) {
    throw error;
  }
}

/**
 * GPT4Free API
 */
async function callGPT4Free(api, message) {
  const response = await axios.post(api.endpoint, {
    messages: [
      { role: 'user', content: message }
    ]
  }, {
    timeout: 12000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.data && response.data.message) {
    return response.data.message;
  }
  
  throw new Error('No response from GPT4Free');
}

/**
 * Pollinations AI (MUY CONFIABLE)
 */
async function callPollinations(api, context) {
  const response = await axios.post(api.endpoint, 
    context,
    {
      timeout: 15000,
      headers: {
        'Content-Type': 'text/plain'
      }
    }
  );

  if (response.data && typeof response.data === 'string') {
    return response.data;
  }
  
  throw new Error('No response from Pollinations');
}

/**
 * Nexra API
 */
async function callNexra(api, message) {
  const response = await axios.post(api.endpoint, {
    messages: [
      { role: 'user', content: message }
    ],
    markdown: false
  }, {
    timeout: 12000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.data && response.data.message) {
    return response.data.message;
  }
  
  throw new Error('No response from Nexra');
}

/**
 * AI Chat Free
 */
async function callAIChat(api, message) {
  const response = await axios.get(api.endpoint, {
    params: {
      question: message
    },
    timeout: 12000
  });

  if (response.data && response.data.answer) {
    return response.data.answer;
  }
  
  throw new Error('No response from AI Chat');
}

/**
 * IA Local Avanzada con NLP básico
 */
function advancedLocalAI(input, history) {
  const lower = input.toLowerCase();
  const words = lower.split(' ');
  
  // Sistema de patrones mejorado
  const patterns = [
    {
      keywords: ['hola', 'hey', 'buenas', 'saludos', 'ey', 'alo'],
      weight: 1.0,
      responses: [
        '¡Hola! 👋 Soy Nagui, tu asistente de IA.\n\n¿En qué puedo ayudarte hoy?',
        '¡Hey! ¿Qué tal? 😊\n\n¿Qué necesitas?',
        '¡Buenas! Soy Nagui 🤖\n\nCuéntame, ¿en qué te ayudo?'
      ]
    },
    {
      keywords: ['gracias', 'thanks', 'grax', 'thank you'],
      weight: 1.0,
      responses: [
        '¡De nada! 😊 Estoy aquí para ayudarte.\n\n¿Algo más?',
        'Para eso estoy 👍\n\n¿Necesitas algo más?',
        'Con gusto, es un placer ayudarte ✨'
      ]
    },
    {
      keywords: ['adios', 'bye', 'chao', 'hasta luego', 'nos vemos'],
      weight: 1.0,
      responses: [
        '¡Hasta luego! 👋 Vuelve cuando quieras',
        'Nos vemos, ¡cuídate! ✌️',
        'Chao, ha sido un placer ayudarte 😊'
      ]
    },
    {
      keywords: ['quien eres', 'que eres', 'tu nombre', 'presentate', 'te llamas'],
      weight: 0.9,
      responses: [
        '🤖 Soy *Nagui*, tu asistente de IA para WhatsApp.\n\n*Puedo ayudarte con:*\n• Responder preguntas\n• Explicar conceptos\n• Ayuda con código\n• Consejos útiles\n• ¡Y mucho más!\n\n¿Qué necesitas? 😊'
      ]
    },
    {
      keywords: ['chiste', 'broma', 'gracioso', 'rie', 'humor'],
      weight: 1.0,
      responses: [
        '😄 Ahí va uno:\n\n¿Por qué los programadores prefieren el modo oscuro?\n\nPorque *la luz atrae bugs* 🐛💡',
        '🤣 Te cuento:\n\nDoctor, tengo complejo de feo.\n- No es complejo, es *simple* 😅',
        '😂 Escucha esto:\n\nEntró un 0 y un 8 a un bar.\nDijo el 0: "Hoy invito yo, que estoy en-8-" 🍺',
        '😆 Va un chiste:\n\n¿Cuál es el colmo de un informático?\nTener un hijo que no sea *PC* 💻'
      ]
    },
    {
      keywords: ['como estas', 'que tal', 'como va', 'todo bien'],
      weight: 0.9,
      responses: [
        'Funcionando al 100% 🚀\n\n¿Y tú? ¿En qué te puedo ayudar?',
        'Todo bien por aquí 😊\n\n¿Cómo estás tú? ¿Qué necesitas?',
        'Listo para ayudarte 💪\n\n¿Qué tal tú?'
      ]
    },
    {
      keywords: ['ayuda', 'help', 'que haces', 'comandos', 'funciones'],
      weight: 0.8,
      responses: [
        '🤖 *PUEDO AYUDARTE CON:*\n\n💡 Responder preguntas\n📚 Explicar conceptos\n💻 Ayuda con programación\n✍️ Escribir textos\n🧮 Resolver problemas\n💬 Conversar de cualquier tema\n🎯 Consejos prácticos\n\n*¿Qué necesitas?* 😊'
      ]
    },
    {
      keywords: ['python', 'javascript', 'codigo', 'programar', 'code', 'html', 'css'],
      weight: 0.7,
      responses: [
        '💻 *Ayuda con programación*\n\nPuedo ayudarte con:\n• Explicar conceptos\n• Revisar código\n• Solucionar errores\n• Mejores prácticas\n• Ejemplos de código\n\n¿Qué lenguaje usas y qué necesitas hacer?'
      ]
    },
    {
      keywords: ['como', 'que es', 'explica', 'enseña', 'define'],
      weight: 0.5,
      responses: [
        '🤔 Buena pregunta.\n\nEstoy en modo limitado ahora, pero puedo intentar ayudarte.\n\n¿Puedes ser más específico sobre qué quieres saber?',
        '📚 Me encantaría explicarte eso en detalle.\n\nAunque estoy con capacidades reducidas, intentaré ayudarte.\n\n¿Puedes darme más contexto o reformular tu pregunta?'
      ]
    }
  ];

  // Buscar coincidencias con peso
  let bestMatch = null;
  let bestScore = 0;

  for (const pattern of patterns) {
    const matches = pattern.keywords.filter(kw => lower.includes(kw)).length;
    const score = matches * pattern.weight;
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = pattern;
    }
  }

  // Si hay coincidencia fuerte
  if (bestMatch && bestScore > 0.5) {
    const responses = bestMatch.responses;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Análisis de tipo de pregunta
  if (lower.includes('?')) {
    return '🤔 *Interesante pregunta*\n\nAhora mismo tengo capacidades limitadas, pero normalmente podría darte una respuesta más completa.\n\n¿Puedes:\n• Ser más específico\n• Reformular la pregunta\n• Intentar de nuevo más tarde';
  }

  if (words.length > 20) {
    return '📋 *Veo que es una consulta compleja*\n\nActualmente estoy en modo básico. Para mejores respuestas:\n\n• Divide tu pregunta en partes\n• Sé más específico\n• Intenta de nuevo en unos minutos';
  }

  // Respuesta inteligente por defecto
  const contextualDefaults = [
    '💭 *Entiendo lo que dices*\n\nAunque estoy en modo limitado, haré mi mejor esfuerzo.\n\n¿Puedes darme más detalles o reformular tu pregunta?',
    '🎯 *Interesante tema*\n\nMe gustaría ayudarte mejor, pero tengo capacidades reducidas ahora.\n\n¿Hay algo más específico que necesites?',
    '📝 *Ok, te escucho*\n\nSi reformulas tu pregunta de forma más simple o directa, podré ayudarte mejor.\n\n¿Qué es lo más importante que necesitas saber?'
  ];

  return contextualDefaults[Math.floor(Math.random() * contextualDefaults.length)];
}

/**
 * Limpiar respuesta de la IA
 */
function cleanResponse(response) {
  if (!response) return '';
  
  // Remover prefijos comunes
  response = response.replace(/^(Nagui:|Assistant:|AI:|Bot:)\s*/i, '');
  
  // Remover espacios extra
  response = response.trim();
  
  // Limitar longitud para WhatsApp
  if (response.length > 2000) {
    response = response.substring(0, 1997) + '...';
  }
  
  return response;
}

/**
 * Formatear respuesta final
 */
function formatResponse(response, apiName) {
  // Si es muy corta, no agregar footer
  if (response.length < 50) {
    return response;
  }
  
  return `${response}\n\n_🤖 ${apiName}_`;
}

/**
 * Fallback de emergencia
 */
function emergencyFallback(input) {
  return '⚠️ *Modo de emergencia*\n\n' +
         'Estoy teniendo dificultades técnicas temporales.\n\n' +
         '¿Puedes:\n' +
         '• Intentar de nuevo en unos segundos\n' +
         '• Reformular tu pregunta\n' +
         '• Preguntar algo más simple\n\n' +
         'Disculpa las molestias 🙏';
}

// Limpieza automática de memoria
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [userId, conversation] of conversationMemory.entries()) {
    if (now - conversation.lastActivity > MEMORY_TIMEOUT) {
      conversationMemory.delete(userId);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    console.log(`[Memoria] 🧹 Limpiadas ${cleaned} conversaciones inactivas`);
  }
}, 10 * 60 * 1000); // Cada 10 minutos

console.log('✅ Módulo IA con APIs gratuitas cargado correctamente');