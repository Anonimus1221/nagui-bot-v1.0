@echo off
setlocal enabledelayedexpansion

echo ================================
echo 🧹 Nagui Bot - Limpieza Completa
echo ================================
echo.

REM Cambiar a directorio del bot
cd /d "%~dp0"

REM Esperar a que cierren procesos de Node
echo ⏳ Esperando 5 segundos para que cierren procesos...
timeout /t 5 /nobreak

REM Eliminar carpetas de sesión
echo.
echo 🗑️ Eliminando archivos de sesión...
rmdir /s /q .wwebjs_auth 2>nul
rmdir /s /q .wwebjs_cache 2>nul
if exist .wwebjs_auth (
    echo ❌ No se pudo eliminar .wwebjs_auth
) else (
    echo ✅ .wwebjs_auth eliminado
)
if exist .wwebjs_cache (
    echo ❌ No se pudo eliminar .wwebjs_cache
) else (
    echo ✅ .wwebjs_cache eliminado
)

REM Eliminar log del bot
echo.
echo 📝 Eliminando log anterior...
del /q bot.log 2>nul
if exist bot.log (
    echo ❌ No se pudo eliminar bot.log
) else (
    echo ✅ bot.log eliminado
)

REM Eliminar temporal de ffmpeg
echo.
echo 🎬 Limpiando archivos temporales...
rmdir /s /q temp 2>nul
mkdir temp >nul 2>&1

echo.
echo ✅ Limpieza completada!
echo 🚀 Ahora puedes ejecutar: npm start
echo.
pause
