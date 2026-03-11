const Tarea = require('../models/tarea');

const actualizarEstados = async () => {
  try {
    const ahora = new Date(); 
    const tareas = await Tarea.find();

    for (let tarea of tareas) {
      const diffHoras = (tarea.fechaObjetivo - ahora) / (1000 * 60 * 60);

      let nuevoEstado = 'PENDIENTE';
      if (diffHoras <= 0) {
        nuevoEstado = 'VENCIDA';
      } else if (diffHoras <= 4) {
        nuevoEstado = 'NARANJA';
      } else if (diffHoras <= 24) {
        nuevoEstado = 'AMARILLO';
      }

      if (tarea.estado !== nuevoEstado) {
        tarea.estado = nuevoEstado;
        await tarea.save();
        console.log(`[AUTO] La tarea "${tarea.titulo}" cambió a estado: ${nuevoEstado}`);
      }
    }
  } catch (error) {
    console.error('[AUTO] Error al actualizar tareas:', error);
  }
};

module.exports = actualizarEstados;
