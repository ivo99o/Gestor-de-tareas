const twilio = require('twilio');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Carga explícita del .env

// DEBUG opcional (puede eliminarse luego)
console.log('SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('TOKEN:', process.env.TWILIO_AUTH_TOKEN);

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const enviarWhatsapp = async (mensaje) => {
  try {
    const respuesta = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: process.env.MI_NUMERO_VERIFICADO,
      body: mensaje
    });

    console.log('📩 Mensaje enviado por WhatsApp:', respuesta.sid);
  } catch (error) {
    console.error('❌ Error al enviar mensaje por WhatsApp:', error);
  }
};

module.exports = enviarWhatsapp;
