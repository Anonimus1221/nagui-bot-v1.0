#!/bin/bash

# Script de inicio optimizado con sesión permanente

echo "================================"
echo "🤖 Nagui Bot - Sesión Permanente"
echo "================================"
echo ""

cd "$(dirname "$0")"

# Verificar si hay sesión
if [ -d ".wwebjs_auth" ]; then
    echo "✅ Sesión anterior encontrada"
    echo "🔄 Conectando con sesión guardada..."
else
    echo "❌ No hay sesión previa"
    echo "📱 Necesitarás escanear el QR"
fi

echo ""
echo "⏱️ Configuración:"
echo "• Timeout: 3 minutos"
echo "• QR: 2 minutos para escanear"
echo "• Sesión: Permanente"
echo "• Keep-alive: Cada 30 segundos"
echo ""

node index.js
