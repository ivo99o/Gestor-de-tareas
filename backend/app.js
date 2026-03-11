const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const tareasRoutes = require('./routes/tareasRoutes.js');
app.use('/api/tareas', tareasRoutes);

app.use('/api/tareas', require('./routes/tareasRoutes'));


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB local'))
  .catch(err => console.error('Error al conectar MongoDB:', err));
     
app.get('/', (req, res) => {
  res.send('API de tareas funcionando');
});

module.exports = app;
