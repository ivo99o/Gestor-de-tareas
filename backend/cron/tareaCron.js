const dotenv = require('dotenv');
dotenv.config(); // ahora sí, el .env está en la raíz

// debug para confirmar que se cargaron las variables
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN);
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const MONGO_URI = process.env.MONGO_URI;
const mongoose = require('mongoose')
const moment = require('moment-timezone');
const Tarea = require('../models/tarea');


const TWILIO_FROM = 'whatsapp:+14155238886';
const TWILIO_TO = 'whatsapp:+5493813043167';


const twilio = require('twilio');
const client = twilio(accountSid, authToken);


const actualizarEstadosTareas = async () => {
  try {
    const ahoraArgentina = moment.tz('America/Argentina/Buenos_Aires');
    const tareas = await Tarea.find();

    for (const tarea of tareas) {
      const fechaObjetivo = moment(tarea.fechaObjetivo);
      const diffHoras = fechaObjetivo.diff(ahoraArgentina, 'hours', true);

      let nuevoEstado = tarea.estado;

      if (diffHoras <= 0) {
        nuevoEstado = 'VENCIDA';
      } else if (diffHoras <= 4) {
        nuevoEstado = 'NARANJA';
      } else if (diffHoras <= 24) {
        nuevoEstado = 'AMARILLO';
      } else {
        nuevoEstado = 'PENDIENTE';
      }

      if (tarea.estado !== nuevoEstado) {
        tarea.estado = nuevoEstado;
        await tarea.save();

        const mensaje = `📌 La tarea "${tarea.titulo}" cambió a estado: ${nuevoEstado.toUpperCase()}`;
        await client.messages.create({
          from: TWILIO_FROM,
          to: TWILIO_TO,
          body: mensaje
        });

        console.log(`✅ WhatsApp enviado: ${mensaje}`);
      }
    }

    console.log(`[CRON] Estados actualizados a las ${ahoraArgentina.format('HH:mm:ss')} 🇦🇷`);
  } catch (error) {
    console.error('[CRON] Error al actualizar tareas:', error);
  }
};

// 🧪 Ejecución directa
if (require.main === module) {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('✅ Conectado a MongoDB desde CRON');

      actualizarEstadosTareas();                      
      setInterval(actualizarEstadosTareas, 5 * 60000);
    })
    .catch(err => {
      console.error('❌ Error conectando MongoDB:', err);
    });
}

module.exports = actualizarEstadosTareas;
