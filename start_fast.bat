@echo off
setlocal enabledelayedexpansion

echo ================================
echo 🤖 Nagui Bot - Sesión Permanente
echo ================================
echo.

cd /d "%~dp0"

REM Verificar si hay sesión
if exist ".wwebjs_auth" (
    echo ✅ Sesión anterior encontrada
    echo 🔄 Conectando con sesión guardada...
) else (
    echo ❌ No hay sesión previa
    echo 📱 Necesitarás escanear el QR
)

echo.
echo ⏱️ Configuración:
echo • Timeout: 3 minutos
echo • QR: 2 minutos para escanear
echo • Sesión: Permanente
echo • Keep-alive: Cada 30 segundos
echo.

node index.js
