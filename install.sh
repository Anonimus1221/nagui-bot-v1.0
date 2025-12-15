#!/bin/bash

echo "================================"
echo "   🤖 Nagui Bot 🤖"
echo "================================"
echo ""
echo "Instalando dependencias del bot..."
echo ""


# Instalar mpv si no está instalado
type mpv >/dev/null 2>&1 || pkg install -y mpv

# Reproducir música en segundo plano
mpv musica/AUD-20250322-WA0007.mp3 &

# Instalar dependencias
npm install

echo ""
echo "================================"
echo "Instalación completada!"
echo "Ejecuta 'npm start' para iniciar el bot."
echo "================================"