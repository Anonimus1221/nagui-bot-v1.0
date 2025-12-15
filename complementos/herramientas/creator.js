module.exports = {
  nome: 'creator',
  desc: 'Muestra información del creador',
  run: async (client, message, args) => {
    try {
      const text = `👨‍💻 *Creador del Bot*\n\n🤖 Bot Nagui\n🧑‍💼 Nombre: programmer\n📞 Número: +573182049792\n📸 Instagram: @oliversc_3z\n🔗 Link: https://www.instagram.com/oliversc_3z\nℹ️ Versión: 1.0\n\n❤️ ¡Gracias por usar Nagui!\n⭐ Sígueme en Instagram para actualizaciones.`;
      message.reply(text);
    } catch (error) {
      console.error('Error en creator:', error);
      message.reply('❌ Error al mostrar información del creador.');
    }
  }
};