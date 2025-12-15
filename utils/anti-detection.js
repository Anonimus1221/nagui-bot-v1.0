/**
 * Sistema de Anti-Detección para WhatsApp
 * Evita que el bot sea detectado como bot por WhatsApp
 */

module.exports = {
  // Configuración de delays humanoides
  getRandomDelay: (min = 500, max = 3000) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Delay con distribución más natural (más cortos que largos)
  getHumanDelay: () => {
    const quick = Math.random() < 0.7; // 70% respuestas rápidas
    if (quick) {
      return Math.floor(Math.random() * 1500) + 300; // 300-1800ms
    } else {
      return Math.floor(Math.random() * 3000) + 1500; // 1500-4500ms
    }
  },

  // User agents realistas
  getUserAgent: () => {
    const agents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ];
    return agents[Math.floor(Math.random() * agents.length)];
  },

  // Simular "escribiendo..." con variabilidad
  simulateTyping: (textLength) => {
    // Aproximadamente 40-60 palabras por minuto = 3.3-5 caracteres por segundo
    const charsPerSecond = Math.random() * 1.5 + 3.5;
    return (textLength / charsPerSecond) * 1000;
  },

  // Opciones de puppeteer anti-detección
  getPuppeteerConfig: () => {
    return {
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
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
        '--memory-pressure-off',
        '--no-first-run',
        '--no-service-autorun',
        '--disable-site-isolation-trials',
        '--disable-web-resources',
        '--disable-sync',
        '--disable-translate',
        '--disable-preconnect',
        '--no-default-browser-check',
        '--autoplay-policy=user-gesture-required',
        '--disable-component-update',
        '--disable-client-side-phishing-detection',
        '--disable-hang-monitor',
        '--disable-popup-blocking'
      ],
      ignoreDefaultArgs: ['--disable-extensions'],
      ignoreHTTPSErrors: true,
      timeout: 180000,
      protocolTimeout: 180000,
      defaultViewport: {
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1
      },
      slowMo: 50
    };
  },

  // Patrones de comportamiento más realistas
  shouldRespond: () => {
    // Simular que a veces el bot "no se fija" en ciertos mensajes (muy raro)
    return Math.random() > 0.02; // 98% de respuesta
  },

  // Cambiar entre tipeo rápido y lento ocasionalmente
  getTypingVariation: () => {
    const rand = Math.random();
    if (rand < 0.1) return 'slow'; // 10% escribir lentamente
    if (rand < 0.2) return 'very_fast'; // 10% escribir muy rápido
    return 'normal'; // 80% velocidad normal
  }
};
