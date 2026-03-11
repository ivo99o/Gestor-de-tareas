const express = require('express'); 
const router = express.Router();

const {
  crearTarea,
  obtenerTareas,
  actualizarTarea,
  eliminarTarea
} = require('../controllers/tareasController');

router.post('/', crearTarea);
router.get('/', obtenerTareas);
router.put('/:id', actualizarTarea); // solo una función para PUT
router.delete('/:id', eliminarTarea);

module.exports = router;
