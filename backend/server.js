const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();
const iniciarCron = require('./cron/tareaCron');

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
    iniciarCron();
  })
  .catch(err => console.error(' Error al conectar a MongoDB:', err));