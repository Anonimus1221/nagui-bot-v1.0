<p align="center"> 
<a href="https://github.com/Anonimus1221"><b style="font-size: 32px;">🤖 NAGUI BOT 🤖</b></a> 
</p>

<p align="center">
<b>Gracias por visitar este repositorio 💖</b>
</p>

<p align="center">
<img src="src/img/nagui-presentation.gif" alt="Nagui Bot Presentation - Blue Lock" width="1000"/>
</p>

<p align="center">
  
> Antes de usar este repositorio, asegúrate de leer la **[Licencia](#-licencia)**
</p>

<p align="center">
<a href="#"><img title="Nagui Bot" src="https://img.shields.io/badge/SI TE AGRADA EL REPOSITORIO APOYAME CON UNA 🌟 ¡GRACIAS! -red?colorA=%255ff0000&colorB=%23017e40&style=for-the-badge"></a> 
</p>

<p align="center">
<a href="#"><img title="Nagui Bot" src="https://img.shields.io/badge/LEA TODO EL README-red?colorA=%F77F48FF&colorB=%F77F48FF&style=for-the-badge"></a> 
<a href="#"><img title="Nagui Bot" src="https://img.shields.io/badge/COMPATIBLE CON LA VERSIÓN MULTI DISPOSITIVOS DE WHATSAPP-red?colorA=%F77F48FF&colorB=%F77F48FF&style=for-the-badge"></a>
</p>

<div align="center">
  
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Anonimus1221)
</div>

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Comandos](#-comandos)
- [Licencia](#-licencia)

## 🎯 Características

✨ **Nagui Bot** es un bot de WhatsApp completo con 84 comandos temáticos de Blue Lock:

### Características Principales
- 🎮 **84 Complementos** organizados por categoría
- 🔐 **Dual Authentication**: QR para Windows/Linux, linking code para Termux/Mobile
- 🎨 **Tema Nagui/Blue Lock**: Interfaz personalizada con imágenes temáticas
- ⚡ **Rendimiento Optimizado**: Arquitectura de plugins dinámicos
- 🛡️ **Gestión de Grupos**: Herramientas avanzadas de administración
- 🎵 **Descargas**: YouTube, TikTok (MP3/MP4)
- 🤖 **IA Integrada**: ChatGPT, Gemini, Bard, GPT-4
- 🎭 **Juegos**: Varios juegos interactivos
- 💰 **Sistema de Economía**: Trabajar, robar, apostar, saldo
- 🎬 **Logos**: 13 generadores de logos textuales

## 📥 Instalación

### Requisitos
- **Node.js** v16 o superior
- **npm** (incluido con Node.js)
- **FFmpeg** (para procesamiento de audio/video)
- **yt-dlp** (para descargas de YouTube/TikTok)

### Pasos

#### Windows
```bash
# 1. Clonar repositorio
git clone https://github.com/Anonimus1221/nagui-bot.git
cd nagui-bot

# 2. Instalar dependencias
npm install

# 3. Ejecutar el bot
npm start
```

#### Termux/Android
```bash
# 1. Instalar dependencias del sistema
pkg install -y nodejs ffmpeg git

# 2. Clonar y configurar
git clone https://github.com/Anonimus1221/nagui-bot.git
cd nagui-bot
npm install

# 3. Ejecutar
npm start
```

#### Linux
```bash
# 1. Instalar Node.js y FFmpeg
sudo apt install nodejs npm ffmpeg

# 2. Clonar repositorio
git clone https://github.com/Anonimus1221/nagui-bot.git
cd nagui-bot

# 3. Instalar y ejecutar
npm install
npm start
```

## 🚀 Uso

1. **Escanea el código QR** (Windows/Linux) o usa el **linking code** (Termux/Mobile)
2. **Escribe `.menu`** para ver todos los comandos disponibles
3. **Personaliza** `configuracion/config.json` según necesites

## 📱 Categorías de Comandos

| Categoría | Comandos | Descripción |
|-----------|----------|-------------|
| **Admin** | 25+ | Moderación, antispam, antistickers +18 |
| **Juegos** | 6 | Ranking gay, tapa, beso, etc |
| **IA** | 7 | ChatGPT, Gemini, Bard, GPT-4, etc |
| **Descargas** | 5 | YouTube/TikTok MP3/MP4 |
| **Logos** | 13 | Generadores de texto artistic |
| **Economía** | 4 | Trabajar, saldo, robar, apostar |
| **Herramientas** | 8 | Ping, uptime, hora, info, etc |
| **Búsquedas** | 1 | YouTube search |
| **Stalking** | 2 | Instagram/TikTok stalk |
| **Owner** | 4 | Comandos de propietario |
| **Menus** | 11 | Menús temáticos por categoría |

## ⚙️ Configuración

Edita `configuracion/config.json`:
```json
{
  "prefix": ".",
  "owner": "TU_NUMERO_WHATSAPP",
  "auto_read": true,
  "anti_spam_enabled": true,
  "welcome_message": true
}
```

## 🔄 Reinicio Automático

```bash
# Reinicia automáticamente si el bot se cae
npm run restart-on-crash
```

## 🧹 Limpiar Sesión

```bash
# Elimina sesión guardada para volver a escanear QR
npm run clean-session
```

## 🛠️ Desarrollo

### Estructura del Proyecto
```
nagui-bot/
├── complementos/        # 84 plugins organizados por categoría
├── configuracion/       # Archivos de configuración
├── src/img/            # Imágenes temáticas
├── utils/              # Utilidades
├── index.js            # Punto de entrada
├── package.json        # Dependencias
└── README.md           # Este archivo
```

### Agregar Nuevo Comando

1. Crea archivo en `complementos/categoria/nombre.js`
2. Usa estructura estándar:
```javascript
module.exports = {
  name: "comando",
  category: "categoria",
  execute: async (client, message, args) => {
    // Tu código
  }
};
```

3. El bot lo cargará automáticamente

## ⚠️ Aviso Legal

Este bot es para uso educativo y personal. El usuario es responsable del uso que le dé.

**Descargo de responsabilidad**:
- Bans de WhatsApp por uso inapropiado
- Pérdida de datos
- Daños causados por uso malintencionado

## 📄 Licencia

Este proyecto está bajo licencia **MIT Modificada**.

### Permitido ✅
- Modificar el código
- Distribuir
- Usar privadamente

### Prohibido ❌
- **Uso comercial**
- Vender el código
- Lucrar con este proyecto

⚠️ **Este es un proyecto público y de código abierto. Está terminantemente prohibido vender, comercializar o lucrar con este código.**

**Solo debes**: Incluir la licencia y los créditos originales en distribuciones.

## 📊 Estadísticas

- **84** Complementos funcionales
- **0** Errores de compilación
- **13** Dependencias npm
- **100%** Código personalizado

## 🌟 Contribuciones

Para contribuir:
1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcion`)
3. Commit (`git commit -m "Agrega nueva función"`)
4. Push (`git push origin feature/nueva-funcion`)
5. Abre un Pull Request

## 📞 Contacto y Soporte

Para reportar bugs o sugerencias, abre un issue en el repositorio de GitHub.

## 🔗 Enlaces Útiles

- [GitHub Repository](https://github.com/Anonimus1221/nagui-bot)
- [WhatsApp Web JS](https://github.com/pedroslopez/whatsapp-web.js)
- [Blue Lock Anime](https://myanimelist.net/anime/51596/Blue_Lock)

---

<div align="center">

**⭐ Si te gustó el proyecto, dame una estrella! ⭐**

*Inspirado en Blue Lock 🔵⚫*

*Hecho con 💖*
</div>
