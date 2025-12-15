# Sistema Anti-Detección de Nagui Bot

Este bot incluye medidas avanzadas para evitar ser detectado como bot por WhatsApp.

## Características de Anti-Detección

### 1. **Delays Humanoides**
- El bot espera entre 500ms y 4500ms antes de responder
- 70% de las respuestas son "rápidas" (300-1800ms)
- 30% de las respuestas son "lentas" (1500-4500ms)
- Simula el comportamiento de un usuario escribiendo

### 2. **Configuración de Puppeteer Optimizada**
- Desactiva flags de automatización típicos de bots
- Usa viewport realista (1920x1080)
- slowMo de 50ms para movimientos más naturales
- User agents realistas que cambian aleatoriamente

### 3. **Comportamiento Natural**
- Ocasionalmente "no responde" a ciertos mensajes (2% de probabilidad)
- Tipeo con variación de velocidad (rápido, normal, lento)
- Respuestas personalizadas con tono humano
- IA privada para chats individuales

### 4. **Sesión Persistente**
- Mantiene sesión autenticada en caché local
- Evita re-autenticaciones frecuentes
- keepalive automático cada 30 segundos

### 5. **Configuración de Conexión**
- Headless mode moderno ('new')
- Ignorar certificados HTTPS inválidos
- Protocolos de protocolo extendido
- Timeout de 3 minutos para conexión

## Cómo Funciona

Cuando el bot responde a un comando:

1. Espera un tiempo aleatorio (delay humanoide)
2. Procesa el comando internamente
3. Genera la respuesta
4. Espera otro delay antes de enviar
5. Envía el mensaje como lo haría un usuario humano

## Uso

No hay configuración adicional necesaria. El sistema anti-detección se activa automáticamente cuando el bot se inicia.

## Archivos Relacionados

- `utils/anti-detection.js` - Módulo con funciones anti-detección
- `index.js` - Integración principal del sistema

## Notas Importantes

- Los delays pueden aumentar el tiempo de respuesta percibido
- Esto es necesario para evitar baneos de WhatsApp
- El bot nunca será detectado al 100%, pero estas medidas reducen significativamente el riesgo
