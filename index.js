const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js');
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const qrcode = require('qrcode-terminal');
const ora = require('ora').default;
const os = require('os');
const { OpenAI } = require('openai');

// Banner del bot
console.log('===============================');
console.log('   🤖 Nagui Bot 🤖');
console.log('===============================');
console.log('Bot personalizado de WhatsApp');
console.log('Creado por Oliver Camacho');
console.log('===============================');
console.log('');

// Cargar configuración
const configPath = path.join(__dirname, 'configuracion', 'config.json');
let config = fs.readJsonSync(configPath);

// Cargar respuestas
const respostasPath = path.join(__dirname, 'configuracion', 'respostas.json');
let respostas = fs.readJsonSync(respostasPath);

// Cargar fotos
const fotosPath = path.join(__dirname, 'configuracion', 'fotos.json');
let fotos = fs.readJsonSync(fotosPath);

// Cargar datos de inactividad
const inactivityPath = path.join(__dirname, 'data', 'inactivity.json');
let inactivityData = fs.readJsonSync(inactivityPath, { throws: false }) || {};

// Cargar datos de silenciados
const silenciadosPath = path.join(__dirname, 'data', 'silenciados.json');
let silenciadosData = fs.readJsonSync(silenciadosPath, { throws: false }) || {};

// Contexto global
global.config = config;
global.respostas = respostas;
global.fotos = fotos;
global.detectarbots = {};

// Variables globales para plugins
global.NomeDoBot = config.bot;
global.criador = "programmer";
global.version = config.version;
global.prefix = config.prefix;
global.resposta = respostas;
global.urlapi = config.urlapi;
global.apikey = config.apikey;

// Funciones globales
global.requisicaoComLimite = async (url) => {
  try {
    const axios = require('axios');
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error en requisicaoComLimite:', error);
    return { error: error.message };
  }
};

global.aumentartotalcmds = () => {};
global.aumentarcmdsgeral = () => {};

// Detectar SO para determinar método de autenticación
const isWindows = process.platform === 'win32';
const isMobile = process.env.TERM_PROGRAM === 'Termux' || process.env.HOME?.includes('data/data/com.termux');
const authMethod = isWindows && !isMobile ? 'QR' : 'LINKING_CODE';

console.log(`🔄 Iniciando Nagui Bot en modo ${authMethod}...`);
console.log(`📱 Plataforma: ${isWindows ? 'Windows' : isMobile ? 'Termux/Mobile' : 'Linux'}\n`);

// Iniciar automáticamente
startWebJS();

// Función para iniciar con whatsapp-web.js
async function startWebJS() {
  const spinner = ora(`🔄 Iniciando whatsapp-web.js (${authMethod})...`).start();
  
  // Verificar si hay sesión anterior válida
  const authPath = path.join(__dirname, '.wwebjs_auth');
  const hasSession = fs.existsSync(authPath);
  
  if (hasSession) {
    console.log('✅ Sesión anterior encontrada. Usando autenticación local.');
  } else {
    if (authMethod === 'QR') {
      console.log('📲 Se mostrarán instrucciones de QR cuando esté listo');
    } else {
      console.log('🔗 Se mostrarán instrucciones de código de vinculación cuando esté listo');
    }
  }
  
  const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-blink-features=AutomationControlled',
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-client-side-phishing-detection',
        '--disable-component-extensions-with-background-pages',
        '--disable-default-apps',
        '--disable-extensions',
        '--disable-features=TranslateUI',
        '--disable-hang-monitor',
        '--disable-popup-blocking',
        '--disable-prompt-on-repost',
        '--enable-automation',
        '--memory-pressure-off',
        '--no-first-run',
        '--no-service-autorun',
        '--disable-site-isolation-trials',
        '--disable-web-resources'
      ],
      ignoreDefaultArgs: [],
      ignoreHTTPSErrors: true,
      timeout: 180000, // 3 minutos para conectar
      protocolTimeout: 180000, // 3 minutos para protocolo
      defaultViewport: {
        width: 1024,
        height: 768
      },
      slowMo: 0 // Sin delay artificial
    },
    takeoverOnConflict: true,
    takeoverTimeoutMs: 90000, // 90 segundos para takeover
    qrMaxRetries: 0, // Sin límite de reintentos
    authTimeoutMs: 0, // Sin timeout
    restartOnAuthFail: false
  });

  let qrRetryCount = 0;
  let isInitialLoading = true;
  
  // Evento para QR o Código de Vinculación
  client.on('qr', (qr) => {
    qrRetryCount++;
    isInitialLoading = false;
    spinner.stop();
    
    if (authMethod === 'QR') {
      // Windows - Mostrar QR
      console.log(`\n📱 QR Generado - Escanea con WhatsApp (Intento ${qrRetryCount})\n`);
      qrcode.generate(qr, { small: true });
      console.log('\n✏️ Abre WhatsApp → Dispositivos emparejados → Escanea este código QR');
      console.log('⏱️ El código vence en 120 segundos (2 minutos), si expira se generará uno nuevo automáticamente\n');
    } else {
      // Termux/Mobile - Mostrar Código de Vinculación
      console.log(`\n🔗 CÓDIGO DE VINCULACIÓN (Intento ${qrRetryCount})\n`);
      console.log('Abre WhatsApp en tu teléfono:');
      console.log('1️⃣  Toca Ajustes > Dispositivos vinculados');
      console.log('2️⃣  Toca Vincular un dispositivo');
      console.log('3️⃣  Ingresa este código:\n');
      
      // Extraer código de vinculación del QR
      const linkingCode = qr.split('v=1;')[1]?.split(';')[0] || qr;
      console.log(`   📲 ${linkingCode}\n`);
      console.log('⏱️ El código vence en 60 segundos\n');
    }
  });

  client.on('loading_screen', (percent, message) => {
    // Solo mostrar el spinner de carga en la carga inicial
    if (isInitialLoading && percent < 100) {
      spinner.start();
      spinner.text = `🔄 Cargando WhatsApp Web... ${percent}%`;
    }
  });

  client.on('ready', () => {
    isInitialLoading = false;
    spinner.stop();
    console.log('✅ Bot listo y conectado!');
    console.log('🎉 ¡Nagui Bot está en línea!\n');
    
    // Mantener la sesión permanente
    client.pupPage.setDefaultTimeout(180000);
    client.pupPage.setDefaultNavigationTimeout(180000);
    
    // Mantener la página activa para evitar desconexiones
    setInterval(async () => {
      try {
        if (client.pupPage && !client.pupPage.isClosed()) {
          // Enviar un comando keepalive
          await client.pupPage.evaluate(() => {
            return true;
          });
        }
      } catch (error) {
        // Ignorar errores
      }
    }, 30000); // Cada 30 segundos
    
    require('./event_handlers/command_handler')(client);
  });

  client.on('auth_failure', (msg) => {
    spinner.fail('❌ Falló la autenticación: ' + msg);
    console.log('💡 Intenta eliminar .wwebjs_auth y .wwebjs_cache y escanea el QR nuevamente.');
    setTimeout(() => process.exit(1), 2000);
  });

  client.on('disconnected', (reason) => {
    spinner.fail('❌ Cliente desconectado: ' + reason);
    
    // LOGOUT significa que WhatsApp cerró la sesión desde el servidor
    if (reason && reason.toString().includes('LOGOUT')) {
      console.log('⚠️ Sesión cerrada por WhatsApp.');
      console.log('🔄 Intentando reconectar en 10 segundos...');
      setTimeout(() => {
        try {
          client.initialize();
        } catch (error) {
          console.log('Error en reconexión, reiniciando...');
          process.exit(0);
        }
      }, 10000);
    } else if (reason && reason.toString().includes('IDLE')) {
      console.log('💤 Bot en inactividad. Intentando reconectar...');
      setTimeout(() => {
        try {
          client.initialize();
        } catch (error) {
          console.log('Error en reconexión...');
        }
      }, 5000);
    } else {
      console.log('⚠️ Desconexión inesperada. Reconectando...');
      setTimeout(() => {
        try {
          client.initialize();
        } catch (error) {
          console.log('Error en reconexión, reiniciando...');
          process.exit(0);
        }
      }, 10000);
    }
  });

  // Manejo de errores de cliente
  client.on('error', (error) => {
    console.error('❌ Error del cliente:', error.message);
    // No salir, esperar a que se recupere
  });

  // Evento de cambio de estado
  client.on('change_state', (state) => {
    console.log(`🔄 Cambio de estado: ${state}`);
  });

  // Evitar que las páginas se cierren
  client.on('page', (page) => {
    page.on('close', () => {
      console.log('⚠️ Una página se cerró. Intentando recuperar...');
    });
  });

  client.on('message', async (msg) => {
    const from = msg.from;
    const isGroup = msg.from.includes('@g.us') || msg.from.includes('@lid');
    const sender = msg.author || msg.from;
    const body = msg.body;

    console.log(`📨 Mensaje de ${sender}: ${body}` + (isGroup ? ' (Grupo)' : ' (Privado)'));

    try {
      // Definir variables globales
      global.isGroup = isGroup;
    global.from = from;
    global.sender = sender;
    global.isOwner = sender.replace(/[^0-9]/g, '') === config.criadorNumber.replace(/[^0-9]/g, '');
    global.isGroupAdmins = false;
    global.isBotGroupAdmins = false;
    global.menc_jid = null;
    global.menc_os2 = false;
    global.nome = sender.split('@')[0];

    if (isGroup) {
      try {
        const chat = await msg.getChat();
        const admins = chat.participants.filter(p => p.isAdmin).map(p => p.id._serialized);
        global.isGroupAdmins = admins.includes(sender);
        global.isBotGroupAdmins = admins.includes(client.info.wid._serialized);
      } catch (error) {
        console.error('Error obteniendo admins:', error);
      }
    }

    // Detectar menciones
    if (msg.mentionedIds && msg.mentionedIds.length > 0) {
      global.menc_jid = msg.mentionedIds[0];
      global.menc_os2 = true;
    }

    // Actualizar inactividad
    if (isGroup) {
      if (!inactivityData[from]) inactivityData[from] = {};
      inactivityData[from][sender] = Date.now();
      fs.writeJsonSync(inactivityPath, inactivityData);
    }

    // Lógica de comandos
    if (body.startsWith(config.prefix)) {
      console.log(`🔧 Comando detectado: ${body.slice(config.prefix.length).split(' ')[0].toLowerCase()}`);
      const command = body.slice(config.prefix.length).split(' ')[0].toLowerCase();
      const args = body.slice(config.prefix.length + command.length).trim().split(' ');

      global.q = args.join(' ');

      const isWebJS = true;
      const wrapperClient = {
        sendMessage: async (jid, content) => {
          console.log('📤 Enviando respuesta a ' + jid + ': ' + (typeof content === 'string' ? content : content.text || content.caption || 'Media'));
          const isUrl = (str) => /^https?:\/\//i.test(str);
          const isGif = (file) => typeof file === 'string' && file.toLowerCase().endsWith('.gif');
          const isMp4 = (file) => typeof file === 'string' && file.toLowerCase().endsWith('.mp4');
          if (typeof content === 'string') {
            return client.sendMessage(jid, content);
          } else if (content.video && isMp4(content.video)) {
            // Enviar video mp4 con caption
            try {
              let media;
              if (typeof content.video === 'string' && !isUrl(content.video)) {
                media = await MessageMedia.fromFilePath(content.video);
              } else if (content.video.url && !isUrl(content.video.url)) {
                media = await MessageMedia.fromFilePath(content.video.url);
              } else {
                const url = typeof content.video === 'string' ? content.video : content.video.url;
                media = await MessageMedia.fromUrl(url, { unsafeMime: true });
              }
              return client.sendMessage(jid, media, { caption: content.caption });
            } catch (error) {
              console.error('Error cargando video mp4:', error);
              return client.sendMessage(jid, content.caption || 'Error con video');
            }
          } else if (content.image || (content.video && isGif(content.video))) {
            // Permitir enviar GIF como imagen o como video indistintamente
            try {
              let file = content.image || content.video;
              let media;
              if (typeof file === 'string' && !isUrl(file)) {
                media = await MessageMedia.fromFilePath(file);
              } else if (file && file.url && !isUrl(file.url)) {
                media = await MessageMedia.fromFilePath(file.url);
              } else {
                const url = typeof file === 'string' ? file : file.url;
                media = await MessageMedia.fromUrl(url, { unsafeMime: true });
              }
              return client.sendMessage(jid, media, { caption: content.caption });
            } catch (error) {
              console.error('Error cargando imagen/gif:', error);
              return client.sendMessage(jid, content.caption || 'Error con imagen/gif');
            }
          } else if (content.video) {
            // Otros videos (webm, mov, etc)
            try {
              let media;
              if (typeof content.video === 'string' && !isUrl(content.video)) {
                media = await MessageMedia.fromFilePath(content.video);
              } else if (content.video.url && !isUrl(content.video.url)) {
                media = await MessageMedia.fromFilePath(content.video.url);
              } else {
                const url = typeof content.video === 'string' ? content.video : content.video.url;
                media = await MessageMedia.fromUrl(url, { unsafeMime: true });
              }
              return client.sendMessage(jid, media, { caption: content.caption });
            } catch (error) {
              console.error('Error cargando video:', error);
              return client.sendMessage(jid, content.caption || 'Error con video');
            }
          } else {
            return client.sendMessage(jid, content.text || content);
          }
        },
        groupParticipantsUpdate: (jid, participants, action) => {
          return client.groupParticipantsUpdate(jid, participants, action);
        }
      };
      const wrapperMsg = {
        from: msg.from,
        author: msg.author,
        body: msg.body,
        key: { remoteJid: msg.from },
        reply: (text) => client.sendMessage(msg.from, text)
      };

      global.bot = wrapperClient;
      global.enviar = (text) => wrapperClient.sendMessage(from, isWebJS ? text : { text });
      global.enviarimg = (url, caption) => wrapperClient.sendMessage(from, { image: { url }, caption });

      // Cargar plugins
      const pluginPath = path.join(__dirname, 'complementos');
      const categories = fs.readdirSync(pluginPath);

      for (const category of categories) {
        const categoryPath = path.join(pluginPath, category);
        if (fs.statSync(categoryPath).isDirectory()) {
          const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));
          for (const file of files) {
            const plugin = require(path.join(categoryPath, file));
            if (plugin.nome === command || (plugin.nomes && plugin.nomes.includes(command))) {
              try {
                await plugin.run(client, msg, args);
              } catch (error) {
                console.error('Error en comando:', error);
                try {
                  await client.sendMessage(msg.from, 'Error en el comando.');
                } catch (sendError) {
                  console.error('Error enviando mensaje de error:', sendError);
                }
              }
              return;
            }
          }
        }
      }
    } else {
      console.log('💬 Mensaje normal');
    }

    // Detección automática de bots
    if (global.detectarbots && global.detectarbots[from] && isGroup && body.startsWith(config.prefix)) {
      try {
        const chat = await msg.getChat();
        const participant = chat.participants.find(p => p.id._serialized === sender);
        if (participant && !participant.isAdmin && sender !== client.info.wid._serialized) {
          await client.groupParticipantsUpdate(from, [sender], 'remove');
          console.log(`Expulsado bot automático: ${sender}`);
        }
      } catch (error) {
        console.error('Error en detección automática:', error);
      }
    }

    // Verificar si el usuario está silenciado y eliminar mensaje
    if (isGroup && silenciadosData[from] && silenciadosData[from].includes(sender) && global.isBotGroupAdmins) {
      try {
        await msg.delete(true);
        console.log(`Mensaje de ${sender} eliminado por estar silenciado.`);
      } catch (e) {
        console.error('Error eliminando mensaje silenciado:', e);
      }
    }

    // IA PRIVADA GRATIS: Responder como humano en chats privados
    if (!isGroup && body && !body.startsWith(config.prefix)) {
      try {
        const reply = generateHumanLikeResponse(body);
        await client.sendMessage(from, reply);
        console.log(`✨ IA Privada: ${reply.substring(0, 50)}...`);
      } catch (error) {
        console.error('Error en IA privada:', error);
      }
    }

  } catch (error) {
    console.error('Unhandled error in message handler:', error);
  }
  });

/**
 * Generar respuestas como un humano
 */
function generateHumanLikeResponse(message) {
  const lower = message.toLowerCase().trim();
  
  // Saludos informales
  if (/^(hola|hey|ey|holaa+|holas|alo|alooo)(\s|$)/.test(lower)) {
    const responses = [
      '¿Ey, qué onda? 👋',
      'Hola! ¿Qué hay? 😊',
      'Ey, ¿todo bien?',
      'Holaa 👋 ¿Cómo va?',
      '¿Ey! ¿Qué pasó?',
      'Hola, ¿para qué me llamaste?',
      '¿Sí? Habla 👂'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Buenos días, tardes, noches
  if (/buenos (dias|días|noches|tardes|días|mañana)/.test(lower)) {
    const responses = [
      'Buenos! ¿Qué tal tu día?',
      'Buenas ☀️ ¿Cómo va?',
      'Hola! Igualmente 😊',
      'Buenas, ¿todo ok?',
      'Buenos! ¿Qué me dices?'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Preguntas sobre estado (cómo estás, qué haces)
  if (/^como (estas|estás)|que (haces|tal|onda|paso)|como va/.test(lower)) {
    const responses = [
      'Ando bien, gracias. ¿Y vos? 😊',
      'Ahí voy, todo normal. ¿Tú qué?',
      'Bien nomás, ¿vos qué onda?',
      'De lo más bien jaja ¿y vos?',
      'Anda, todo ok. ¿Qué hay?',
      'Aquí ando, ¿necesitabas algo?'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Despedidas naturales
  if (/adiós|adios|bye|chao|hasta luego|nos vemos|cuéntate|cuidate|cuídate|sale|listo/.test(lower)) {
    const responses = [
      'Chao! Cuídate 👋',
      'Hasta! Nos vemos',
      'Dale, bye! 😊',
      'Listo, ¡que ande bien!',
      'Chao, vuelve pronto 👋',
      'Nos vemos, cualquier cosa me avisas'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Agradecimientos
  if (/gracias|thx|thanks|merci|tks|mil grac|muchas grac/.test(lower)) {
    const responses = [
      'De nada! 😊',
      'Para eso estoy 👍',
      'Con gusto, bro',
      'No hay de qué',
      'Dale, cualquier cosa me dices'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Preguntas sobre identidad
  if (/quien eres|quién eres|como te llamas|cómo te llamas|tu nombre|que eres|qué eres/.test(lower)) {
    return 'Soy Nagui, tu bot personal de WhatsApp. Acá para lo que necesites 🤖';
  }

  // Solicitar ayuda/menú
  if (/ayuda|help|menu|menú|comandos|que puedes|qué puedes|para qué sirves|que haces|qué hago/.test(lower)) {
    return '🤖 *Puedo hacer:*\n\n✅ Descargar música y videos\n✅ Búsquedas en YouTube\n✅ Responder preguntas\n✅ Juegos y diversión\n✅ Administración de grupos\n\nEscribe *!menu* para ver todo ';
  }

  // Chistes (más realistas)
  if (/chiste|broma|cuenta un chiste|cuéntame|reír|reir|jaja|jajaja/.test(lower)) {
    const jokes = [
      '¿Sabes cuál es la diferencia entre un programador y un normal?\n\nEl programador piensa que es normal 😂',
      '¿Por qué los programadores prefieren el dark mode?\n\nPorque la luz atrae bugs 🐛',
      '¿Qué hace un programador cuando se aburre?\n\n1 != 1',
      '¿Cuál es el colmo de un programador?\n\nTener un hijo que no sea "HTML" 😂',
      '¿Por qué JavaScript va al psicólogo?\n\nTiene demasiados undefined 😅'
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  // Hora y fecha
  if (/que hora|qué hora|hora|tiempo|ahora|ahorita/.test(lower)) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `Son las ${hours}:${minutes} ⏰`;
  }

  if (/que dia|qué día|día|fecha|hoy|día de hoy/.test(lower)) {
    const today = new Date();
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const day = days[today.getDay()];
    const date = today.getDate();
    const month = months[today.getMonth()];
    return `Hoy es ${day}, ${date} de ${month} 📅`;
  }

  // Respuestas cortas a monosílabos
  if (/^(si|sí|claro|ok|vale|bueno|listo|dale|okey)$/.test(lower)) {
    const responses = ['👍', 'Listo!', '✅', 'Dale', 'Joya!'];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (/^(no|nop|nope|nah|negativo|jamás|nunca)$/.test(lower)) {
    const responses = ['Entendido 🤐', 'Dale, no hay problema', '👍', 'Ok, tranqui'];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Mensajes muy cortos
  if (message.length < 4) {
    const responses = [
      '¿Ey? 👀',
      '¿Qué? 😅',
      'No entendí bien',
      'Más claro, porfa 😊'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Preguntas (termina en ?)
  if (/\?$/.test(message)) {
    const responses = [
      'Buena pregunta 🤔',
      'Mmm, ni idea jaja',
      'Eso es todo un tema 😅',
      'No sé, pero suena interesante 🤷',
      'Ufff, pregunta difícil 💭'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Expresiones de sentimientos
  if (/triste|mal|depre|sad|angustia|ansiedad|estoy mal|me duele/.test(lower)) {
    return 'Ey, ¿todo bien? Si necesitas hablar estoy acá 💙';
  }

  if (/feliz|bien|genial|excelente|increíble|amo|love/.test(lower)) {
    return 'Uy, qué bueno! 😊 Contagias esa onda! 🔥';
  }

  // Comentarios generales (respuestas naturales)
  const generalResponses = [
    'Vaya 🤔',
    'Interesante 👀',
    'Entiendo',
    'Dale, dale 👍',
    'Ajá, ajá...',
    'Y eso? 🤷',
    'Cuéntame más 👂',
    'Enserio? 😲',
    'Jajaja, buena 😂',
    'Zas! 💥',
    'Uhh, qué cosa',
    'Obvio, obvio'
  ];

  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
}

  // Event handler para cuando alguien entra al grupo (welcome)
  client.on('group_join', async (notification) => {
    try {
      const chat = await notification.getChat();
      const welcomeMessage = global.config.welcome;

      if (welcomeMessage && (chat.id._serialized.includes('@g.us') || chat.id._serialized.includes('@lid'))) {
        // Obtener información del nuevo miembro (simplificado para evitar errores)
        const newParticipant = notification.recipientIds[0];
        let userName = 'Usuario'; // Nombre por defecto

        try {
          const contact = await client.getContactById(newParticipant);
          userName = contact.pushname || contact.name || 'Usuario';
        } catch (contactError) {
          console.log('No se pudo obtener info del contacto, usando nombre por defecto');
        }

        // Reemplazar @user con la mención
        const personalizedMessage = welcomeMessage.replace('@user', `@${newParticipant.split('@')[0]}`);

        // Enviar mensaje de bienvenida
        await chat.sendMessage(personalizedMessage, { mentions: [newParticipant] });
      }
    } catch (error) {
      console.error('Error en welcome:', error.message);
    }
  });

  // Event handler para cuando alguien sale del grupo (goodbye)
  client.on('group_leave', async (notification) => {
    try {
      const chat = await notification.getChat();
      const goodbyeMessage = global.config.goodbye;

      if (goodbyeMessage && (chat.id._serialized.includes('@g.us') || chat.id._serialized.includes('@lid'))) {
        // Obtener información del miembro que salió (simplificado para evitar errores)
        const leftParticipant = notification.recipientIds[0];
        let userName = 'Usuario'; // Nombre por defecto

        try {
          const contact = await client.getContactById(leftParticipant);
          userName = contact.pushname || contact.name || 'Usuario';
        } catch (contactError) {
          console.log('No se pudo obtener info del contacto, usando nombre por defecto');
        }

        // Reemplazar @user con la mención
        const personalizedMessage = goodbyeMessage.replace('@user', `@${leftParticipant.split('@')[0]}`);

        // Enviar mensaje de despedida
        await chat.sendMessage(personalizedMessage, { mentions: [leftParticipant] });
      }
    } catch (error) {
      console.error('Error en goodbye:', error.message);
    }
  });

  // Event handler para expulsiones
  client.on('group_participants_update', async (notification) => {
    try {
      const chat = await notification.getChat();
      const action = notification.action;
      const participants = notification.participants;

      if (action === 'remove' && (chat.id._serialized.includes('@g.us') || chat.id._serialized.includes('@lid'))) {
        for (const participant of participants) {
          let userName = 'Usuario'; // Nombre por defecto

          try {
            const contact = await client.getContactById(participant);
            userName = contact.pushname || contact.name || 'Usuario';
          } catch (contactError) {
            console.log('No se pudo obtener info del contacto, usando nombre por defecto');
          }

          const expelMessage = `@${userName.split(' ')[0]} fue expulsado por incumplir las reglas.`;

          // Enviar mensaje de expulsión
          await client.sendMessage(chat.id._serialized, expelMessage);
        }
      }
    } catch (error) {
      console.error('Error en expulsion:', error.message);
    }
  });

  // Inicializar cliente con timeout y reintentos optimizados
  const initTimeout = setTimeout(() => {
    spinner.fail('❌ Timeout: La inicialización tomó demasiado tiempo');
    console.log('💡 Sugerencias:');
    console.log('   - Verifica tu conexión a internet');
    console.log('   - Elimina .wwebjs_auth y .wwebjs_cache');
    process.exit(1);
  }, 300000); // 5 minutos timeout

  let retries = 0;
  const maxRetries = 2;

  const tryInitialize = async () => {
    try {
      if (retries === 0) {
        spinner.text = `🔄 Conectando a WhatsApp Web...`;
      } else {
        console.log(`\n🔄 Reintentando... (intento ${retries + 1}/${maxRetries})`);
      }
      await client.initialize();
      clearTimeout(initTimeout);
    } catch (error) {
      retries++;
      const errorMsg = error.message || error.toString();
      
      // Errores que no se deben reintentar
      if (errorMsg.includes('ENOTFOUND') || errorMsg.includes('ERR_NAME_NOT_RESOLVED')) {
        clearTimeout(initTimeout);
        spinner.fail('❌ Error de conexión: Verifica tu internet');
        process.exit(1);
      }

      if (retries < maxRetries) {
        console.log(`⚠️ Error: ${errorMsg}`);
        console.log(`⏳ Esperando 5 segundos antes de reintentar...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        await tryInitialize();
      } else {
        clearTimeout(initTimeout);
        spinner.fail('❌ No se pudo conectar');
        console.log('\nSoluciones:');
        console.log('1. Verifica tu conexión a internet');
        console.log('2. Elimina: .wwebjs_auth y .wwebjs_cache');
        console.log('3. Cierra otras aplicaciones que usen mucha memoria');
        process.exit(1);
      }
    }
  };

  await tryInitialize();
}
