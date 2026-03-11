const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  categoria: {
    type: String,
    enum: ['laboral', 'estudio', 'hogar', 'recordatorio'],
    required: true
  },
  fechaObjetivo: {
    type: Date,
    required: true
  },
  estado: {
    type: String,
    enum: ['PENDIENTE', 'AMARILLO', 'NARANJA', 'VENCIDA'],
    default: 'PENDIENTE'
  },
  telefono : {
    type: String,
    required: true
  },
  avisosEnviados: {
    type: [String],
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tarea', tareaSchema);