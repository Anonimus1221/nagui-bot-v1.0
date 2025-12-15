<p align="center"> 
<a href="https://github.com/Anonimus1221"><b style="font-size: 32px;">🤖 NAGUI BOT 🤖</b></a> 
</p>

<p align="center">
<b>Gracias por visitar este repositorio 💖</b>
</p>

<p align="center">
<img src="https://media.tenor.com/BjWSmC5cQVAAAAAC/blue-lock-nagi-seishiro.gif" alt="Nagui Bot - Blue Lock" width="800"/>
  
> Antes de usar este repositorio, asegúrate de leer la **[Licencia MIT](#-licencia)**
</p>

<p align="center">
<a href="#"><img title="Nagui Bot" src="https://img.shields.io/badge/SI TE AGRADA EL REPOSITORIO APOYAME CON UNA 🌟 ¡GRACIAS! -red?colorA=%255ff0000&colorB=%23017e40&style=for-the-badge"></a> 
</p>

<p align="center">
<a href="#"><img title="Nagui Bot" src="https://img.shields.io/badge/LEA TODO EL README-red?colorA=%F77F48FF&colorB=%F77F48FF&style=for-the-badge"></a> 
<a href="#"><img title="Nagui Bot" src="https://img.shields.io/badge/COMPATIBLE CON LA VERSIÓN MULTI DISPOSITIVOS DE WHATSAPP-red?colorA=%F77F48FF&colorB=%F77F48FF&style=for-the-badge"></a>
</p>

<div align="center">
  
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:olivercamachodiaz2008@gmail.com)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/573182049792)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/oliversc_3z)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Anonimus1221)
</div>

-----

# 🤖 Nagui Bot

Un bot personalizado de WhatsApp inspirado en **Blue Lock**, creado por **Anonimus1221**. Diseñado para ofrecer una experiencia única con comandos divertidos, herramientas útiles y un toque de anime.

## 📋 Descripción

**Nagui Bot** es un bot multifuncional para WhatsApp que incluye:
- ✅ 84 complementos activos
- ✅ 11 categorías de comandos
- ✅ Autenticación dual (QR + Código de vinculación)
- ✅ Sistema de economía y juegos
- ✅ IA integrada
- ✅ Gestión avanzada de grupos

Compatible con **Windows** (QR), **Termux/Linux** (código de vinculación) y **Servidores**.

## ✨ Características Principales

- 🔧 **84 Complementos Modulares**: Plugins organizados por 11 categorías
- 📱 **Autenticación Dual**: QR en Windows / Código en Termux-Mobile
- 👥 **Gestión de Grupos**: Admin tools, bans, expulsiones automáticas
- 🎮 **Juegos**: Rankings, besos, tapas, anime-hello
- 🤖 **IA**: ChatGPT, Gemini, Bard, GPT4
- 🎬 **Descargas**: YouTube, TikTok (MP3 y MP4)
- 🎨 **Generador de Logos**: Blackpink, Dragon Ball, Neon, Matrix, etc.
- 💰 **Sistema de Economía**: Trabajar, robar, apostar
- 🔐 **Sesiones Persistentes**: Reconnexión automática
- 🌍 **IA Privada**: Responde inteligentemente en chats privados

## 📂 Estructura del Proyecto

```
nagui-bot/
├── index.js                      # Archivo principal
├── package.json                  # Dependencias
├── complementos/                 # 84 Plugins por categorías
│   ├── admin/                    # Comandos de administración (25+)
│   ├── juegos/                   # Juegos y diversión (6)
│   ├── ia/                       # Inteligencia Artificial (7)
│   ├── descargas/                # Descarga de multimedia (5)
│   ├── logos/                    # Generadores de logos (13)
│   ├── economia/                 # Sistema económico (4)
│   ├── herramientas/             # Utilidades (8)
│   ├── busquedas/                # Búsquedas (1)
│   ├── acechos/                  # Stalking (2)
│   ├── dueno/                    # Comandos del owner (4)
│   └── menus/                    # Menús interactivos (11)
├── configuracion/                # Archivos de configuración
├── event_handlers/               # Manejadores de eventos
├── data/                         # Datos persistentes
├── utils/                        # Utilidades
├── bin/                          # Ejecutables (yt-dlp)
├── ffmpeg/                       # FFmpeg para conversión
├── README.md                     # Este archivo
└── credits.txt                   # Créditos del proyecto
```

## 🚀 Instalación Rápida

### Windows
```bash
git clone https://github.com/Anonimus1221/nagui-bot.git
cd nagui-bot
npm install
npm start
```

### Termux/Linux
```bash
pkg update && pkg install -y git nodejs ffmpeg
git clone https://github.com/Anonimus1221/nagui-bot.git
cd nagui-bot
npm install
npm start
```

### 24/7 en Termux (con PM2)
```bash
npm i -g pm2
pm2 start index.js
pm2 save
```

## ⚙️ Configuración

**Edita los archivos en `configuracion/`:**

1. **config.json**: Ajustes generales
   - Prefijo de comandos (default: `.`)
   - Número del owner
   - URL API (opcional)

2. **respostas.json**: Respuestas personalizadas

3. **fotos.json**: URLs de imágenes

## 📖 Uso de Comandos

- **Prefijo**: `.` (ej: `.help`)
- **Menú Principal**: `.menu`
- **Ayuda**: `.help`
- **Información**: `.info`
- **Ping**: `.ping`

## 🎮 Categorías de Comandos

| Categoría | Comandos | Ejemplo |
|-----------|----------|---------|
| **Admin** | 25+ | `.silenciar`, `.expulsar`, `.promover` |
| **Juegos** | 6 | `.rankgay`, `.tapa`, `.beijar` |
| **IA** | 7 | `.chatgpt`, `.gemini`, `.bard` |
| **Descargas** | 5 | `.play`, `.ytmp3`, `.tiktokmp4` |
| **Logos** | 13 | `.neon`, `.matrix`, `.fire` |
| **Economía** | 4 | `.trabajar`, `.robar`, `.saldo` |

## 📦 Dependencias

- **whatsapp-web.js** - Cliente de WhatsApp
- **axios** - Peticiones HTTP
- **fs-extra** - Operaciones de archivos
- **puppeteer** - Automatización
- **openai** - API de IA
- **qrcode-terminal** - Código QR en terminal
- **ytdl-core** - Descarga de YouTube

## 🔐 Seguridad y Privacidad

- Las credenciales se guardan en `.wwebjs_auth/`
- No compartir archivos de sesión
- Usar contraseñas fuertes para owner
- Revisar permisos en grupos

## 🤝 Contribución

```bash
# Fork el proyecto
git clone https://github.com/TU-USUARIO/nagui-bot.git

# Crea tu rama
git checkout -b feature/nueva-funcion

# Commit y Push
git add .
git commit -m "Agrega nueva función"
git push origin feature/nueva-funcion
```

## 📞 Contacto y Soporte

- **Creador**: Anonimus1221 (Oliver Camacho)
- **Instagram**: [@oliversc_3z](https://instagram.com/oliversc_3z)
- **WhatsApp**: [+573182049792](https://wa.me/573182049792)
- **Email**: [olivercamachodiaz2008@gmail.com](mailto:olivercamachodiaz2008@gmail.com)
- **GitHub**: [@Anonimus1221](https://github.com/Anonimus1221)

## ⚠️ Aviso Legal

Este bot es para uso educativo y personal. El usuario es responsable del uso que le dé. No somos responsables de:
- Bans de WhatsApp
- Pérdida de datos
- Uso malintencionado

## 📄 Licencia

Este proyecto está bajo licencia **MIT**. Eres libre de:
- ✅ Usar comercialmente
- ✅ Modificar el código
- ✅ Distribuir
- ✅ Usar privadamente

**Solo debes**: Incluir la licencia y los créditos originales.

---

<div align="center">

**⭐ Si te gustó el proyecto, dame una estrella! ⭐**

**Hecho con 💖 por Anonimus1221**

*Inspirado en Blue Lock 🔵⚫*

</div>
