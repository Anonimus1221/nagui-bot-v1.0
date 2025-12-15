const { spawn } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

const LOG_FILE = path.join(__dirname, 'bot.log');
const SESSION_DIR = path.join(__dirname, '.wwebjs_auth');
const MAX_RESTARTS = 100; // Aumentado a 100 para permitir más reinicios
let restartCount = 0;
let lastQRScanned = false;

function log(message) {
  const timestamp = new Date().toLocaleString('es-ES');
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  
  try {
    fs.appendFileSync(LOG_FILE, logMessage + '\n');
  } catch (error) {
    console.error('Error escribiendo log:', error);
  }
}

// Función para verificar si hay sesión válida
function hasValidSession() {
  if (!fs.existsSync(SESSION_DIR)) {
    return false;
  }
  
  try {
    const sessionFiles = fs.readdirSync(SESSION_DIR);
    return sessionFiles.length > 0;
  } catch (error) {
    return false;
  }
}

// Función para limpiar archivos de sesión con reintentos
function cleanSessionFiles(force = false) {
  const authPath = path.join(__dirname, '.wwebjs_auth');
  const cachePath = path.join(__dirname, '.wwebjs_cache');
  
  if (force) {
    log('🧹 Limpieza forzada de sesiones...');
  }
  
  const paths = [authPath, cachePath];
  
  paths.forEach(dirPath => {
    if (fs.existsSync(dirPath)) {
      try {
        // En Windows, usar comando del para forzar eliminación
        execSync(`rmdir /s /q "${dirPath}"`, { stdio: 'ignore' });
        log(`✅ Limpiado: ${path.basename(dirPath)}`);
      } catch (error) {
        // Si falla, intentar con fs
        try {
          fs.removeSync(dirPath);
          log(`✅ Limpiado: ${path.basename(dirPath)}`);
        } catch (fsError) {
          if (force) {
            log(`⚠️ No se pudo limpiar ${path.basename(dirPath)}: ${fsError.message}`);
          }
        }
      }
    }
  });
}

function startBot() {
  restartCount++;
  
  const hasSession = hasValidSession();
  const sessionStatus = hasSession ? '✅ Con sesión guardada' : '❌ Sin sesión (requiere QR)';
  
  log(`🚀 Iniciando bot (Intento ${restartCount}/${MAX_RESTARTS}) - ${sessionStatus}`);
  
  if (restartCount > MAX_RESTARTS) {
    log('❌ Se alcanzó el máximo de reinicios. Deteniendo.');
    log('💡 Ejecuta: clean-all.bat y luego npm start');
    console.error('El bot se reinició demasiadas veces. Verifica los errores en el log.');
    process.exit(1);
  }

  // Limpiar sesiones solo en ciertos casos
  if (restartCount > 1 && restartCount % 10 === 0) {
    log('⚠️ Limpieza preventiva de caché (reinicio #' + restartCount + ')');
    try {
      const cachePath = path.join(__dirname, '.wwebjs_cache');
      if (fs.existsSync(cachePath)) {
        execSync(`rmdir /s /q "${cachePath}"`, { stdio: 'ignore' });
      }
    } catch (error) {
      // Ignorar errores de limpieza
    }
  }

  const bot = spawn('node', ['index.js'], {
    cwd: __dirname,
    stdio: 'inherit', // Mostrar salida directamente
    detached: false,
    env: {
      ...process.env,
      NODE_ENV: 'production'
    }
  });

  bot.on('error', (error) => {
    log(`❌ Error iniciando bot: ${error.message}`);
  });

  bot.on('exit', (code, signal) => {
    if (signal === 'SIGTERM' || signal === 'SIGKILL') {
      log(`⚠️ Bot terminado por señal: ${signal}`);
      process.exit(0);
    }
    
    if (code === 0) {
      log(`ℹ️ Bot cerrado normalmente (código: ${code})`);
    } else {
      log(`❌ Bot cerrado con error (código: ${code})`);
    }
    
    // Tiempo de espera según el número de reintentos
    let waitTime = 15000; // 15 segundos por defecto
    if (restartCount > 5) {
      waitTime = 20000; // 20 segundos después del 5to intento
    }
    if (restartCount > 10) {
      waitTime = 30000; // 30 segundos después del 10mo intento
    }
    
    log(`⏳ Esperando ${waitTime / 1000} segundos antes de reiniciar...\n`);
    setTimeout(startBot, waitTime);
  });
}

// Manejo de señales para detener gracefully
process.on('SIGINT', () => {
  log('\n⛔ Recibida señal SIGINT. Deteniendo gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('\n⛔ Recibida señal SIGTERM. Deteniendo gracefully...');
  process.exit(0);
});

log('================================');
log('🤖 Nagui Bot - Restart Manager');
log('================================');
log('Este script reinicia automáticamente el bot si se desconecta.');
log('Presiona Ctrl+C para detener.\n');

// Mostrar estado de la sesión
const sessionStatus = hasValidSession() ? '✅ SESIÓN DETECTADA' : '❌ SIN SESIÓN (Necesitarás escanear QR)';
log(`Estado inicial: ${sessionStatus}\n`);

startBot();
