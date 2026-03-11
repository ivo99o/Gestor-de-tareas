const Tarea = require('../models/tarea');
const actualizarEstados = require('../cron/tareaCronFuncion');
const moment = require('moment-timezone');

const crearTarea = async (req, res) => {
  try {
    const { titulo, categoria, telefono, fechaObjetivo, horaObjetivo } = req.body;

    const fechaCompleta = moment.tz(
      `${fechaObjetivo} ${horaObjetivo}`,
      'YYYY-MM-DD HH:mm',
      'America/Argentina/Buenos_Aires'
    ).toDate();

    const nuevaTarea = new Tarea({
      titulo,
      categoria,
      telefono,
      fechaObjetivo: fechaCompleta,
      estado: 'PENDIENTE'
    });

    const tareaGuardada = await nuevaTarea.save();

    await actualizarEstados();

    res.status(201).json(tareaGuardada);

  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(400).json({ error: error.message });
  }
};

const obtenerTareas = async (req, res) => {
  try {
    const tareas = await Tarea.find().sort({ fechaObjetivo: 1 });
    res.json(tareas);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ mensaje: 'Error al obtener tareas', error });
  }
};

const actualizarTarea = async (req, res) => {
  try {
    const { titulo, categoria, telefono, fechaObjetivo, horaObjetivo } = req.body;

    const fechaCompleta = moment.tz(
      `${fechaObjetivo} ${horaObjetivo}`,
      'YYYY-MM-DD HH:mm',
      'America/Argentina/Buenos_Aires'
    ).toDate();

    const tareaActualizada = await Tarea.findByIdAndUpdate(
      req.params.id,
      {
        titulo,
        categoria,
        telefono,
        fechaObjetivo: fechaCompleta
      },
      { new: true, runValidators: true }
    );

    if (!tareaActualizada) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    }

    await actualizarEstados();

    res.json(tareaActualizada);
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(400).json({ mensaje: 'Error al actualizar tarea', error });
  }
};

const eliminarTarea = async (req, res) => {
  try {
    const tareaEliminada = await Tarea.findByIdAndDelete(req.params.id);

    if (!tareaEliminada) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    }

    res.json({ mensaje: 'Tarea eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ mensaje: 'Error al eliminar tarea', error });
  }
};

module.exports = {
  crearTarea,
  obtenerTareas,
  actualizarTarea,
  eliminarTarea
};
