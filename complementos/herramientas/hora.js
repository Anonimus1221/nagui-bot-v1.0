const axios = require('axios');

module.exports = {
  nome: 'hora',
  desc: 'Muestra la hora actual en un país',
  run: async (client, msg, args) => {
    try {
      const country = args.join(' ').toLowerCase();
      if (!country) {
        return client.sendMessage(msg.from, '⏰ Especifica un país.\n\nEjemplo: .hora mexico');
      }

      // Mapa de países a zonas horarias (simplificado)
      const timezones = {
        'mexico': 'America/Mexico_City',
        'españa': 'Europe/Madrid',
        'argentina': 'America/Argentina/Buenos_Aires',
        'colombia': 'America/Bogota',
        'peru': 'America/Lima',
        'chile': 'America/Santiago',
        'ecuador': 'America/Guayaquil',
        'bolivia': 'America/La_Paz',
        'uruguay': 'America/Montevideo',
        'paraguay': 'America/Asuncion',
        'venezuela': 'America/Caracas',
        'brasil': 'America/Sao_Paulo',
        'eeuu': 'America/New_York',
        'estados unidos': 'America/New_York',
        'canada': 'America/Toronto',
        'reino unido': 'Europe/London',
        'francia': 'Europe/Paris',
        'alemania': 'Europe/Berlin',
        'italia': 'Europe/Rome',
        'japon': 'Asia/Tokyo',
        'china': 'Asia/Shanghai',
        'rusia': 'Europe/Moscow',
        'australia': 'Australia/Sydney',
        'india': 'Asia/Kolkata'
      };

      const timezone = timezones[country];
      if (!timezone) {
        return client.sendMessage(msg.from, '❌ País no encontrado.\n\n📍 Países disponibles:\n' + Object.keys(timezones).join(', '));
      }

      const response = await axios.get(`https://timeapi.io/api/Time/current/zone?timeZone=${timezone}`, { timeout: 10000 });
      const datetime = new Date(response.data.dateTime);
      const time = datetime.toLocaleTimeString('es-ES', { timeZone: timezone, hour12: true });
      const countryDisplay = country.charAt(0).toUpperCase() + country.slice(1);

      client.sendMessage(msg.from, `🕐 *Hora en ${countryDisplay}:*\n\n⏱️ ${time}`);
    } catch (error) {
      console.error('Error en hora:', error);
      client.sendMessage(msg.from, '❌ Error al obtener la hora. Intenta más tarde.');
    }
  }
};