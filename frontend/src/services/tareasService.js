import ky from 'ky';

const API_URL = 'http://localhost:4000/api/tareas';

export const obtenerTareas = () => ky.get(API_URL).json();

export const crearTarea = (tarea) => ky.post(API_URL, { json: tarea }).json();

export const eliminarTarea = (id) => ky.delete(`${API_URL}/${id}`);