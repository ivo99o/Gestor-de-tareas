import React, { useEffect, useState } from "react";
import {
  obtenerTareas,
  crearTarea,
  eliminarTarea,
} from "./services/tareasService";
import ky from "ky";
import "./App.css";

const colorEstado = {
  NARANJA: "#FF5E00",
  AMARILLO: "#FFE908",
  PENDIENTE: "#8F8F8F",
  VENCIDA: "#E1253B",
};

function App() {
  const [tareas, setTareas] = useState([]);
  const [formulario, setFormulario] = useState({
    titulo: "",
    categoria: "",
    telefono: "",
    fechaObjetivo: "",
    horaObjetivo: "",
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtroActivo, setFiltroActivo] = useState("Todos");

  useEffect(() => {
    cargarTareas();
  }, []);

  const cargarTareas = async () => {
    try {
      const data = await obtenerTareas();
      setTareas(data);
    } catch (err) {
      setError("Error al cargar tareas");
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearTarea(formulario);
      await cargarTareas();
      setFormulario({
        titulo: "",
        categoria: "",
        telefono: "",
        fechaObjetivo: "",
        horaObjetivo: "",
      });
    } catch (err) {
      console.error("Error al crear tarea:", err);
    }
  };

  const handleActualizar = async (e) => {
    e.preventDefault();
    try {
      await ky
        .put(`http://localhost:4000/api/tareas/${idEditando}`, {
          json: formulario,
        })
        .json();
      await cargarTareas();
      setFormulario({
        titulo: "",
        categoria: "",
        telefono: "",
        fechaObjetivo: "",
        horaObjetivo: "",
      });
      setModoEdicion(false);
      setIdEditando(null);
    } catch (err) {
      console.error("Error al actualizar tarea:", err);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que querés eliminar esta tarea?")) {
      try {
        await eliminarTarea(id);
        await cargarTareas();
      } catch (err) {
        console.error("Error al eliminar tarea:", err);
      }
    }
  };

  const ordenarTareas = (lista) => {
    const prioridadEstado = {
      VENCIDA: 1,
      NARANJA: 2,
      AMARILLO: 3,
      PENDIENTE: 4,
    };

    return [...lista].sort((a, b) => {
      const prioridadA = prioridadEstado[a.estado] || 5;
      const prioridadB = prioridadEstado[b.estado] || 5;

      if (prioridadA !== prioridadB) {
        return prioridadA - prioridadB;
      }

      return new Date(a.fechaObjetivo) - new Date(b.fechaObjetivo);
    });
  };

  const tareasFiltradas =
    filtroActivo === "Todos"
      ? tareas
      : filtroActivo === "Pendiente"
      ? tareas.filter((t) => t.estado === "PENDIENTE")
      : tareas.filter(
          (t) => t.categoria.toLowerCase() === filtroActivo.toLowerCase()
        );

  return (
    <div className="app-container">
      <div className="columna-izquierda">
        <h1 className="titulo-app">Lista de Tareas</h1>
        <div className="divisor" />
        <form
          onSubmit={modoEdicion ? handleActualizar : handleSubmit}
          className="formulario"
        >
          <input
            type="text"
            name="titulo"
            placeholder="Título"
            value={formulario.titulo}
            onChange={handleChange}
            required
            className="capitalize"
          />
          <input
            type="text"
            name="categoria"
            placeholder="Categoría"
            value={formulario.categoria}
            onChange={handleChange}
            required
            className="capitalize"
          />
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={formulario.telefono}
            onChange={handleChange}
            required
            className="capitalize"
          />
          <input
            type="date"
            name="fechaObjetivo"
            value={formulario.fechaObjetivo}
            onChange={handleChange}
            required
          />
          <input
            type="time"
            name="horaObjetivo"
            value={formulario.horaObjetivo}
            onChange={handleChange}
            required
          />
          <button type="submit" className="boton-submit">
            {modoEdicion ? "Actualizar Tarea" : "Crear Tarea"}
          </button>
        </form>
      </div>

      <div className="columna-derecha">
        <h2 className="titulo-secundario">Tareas</h2>
        <div className="filtros">
          {["Todos", "Laboral", "Estudio", "Recordatorio", "Pendiente"].map(
            (cat) => (
              <button
                key={cat}
                className={`filtro-boton ${
                  filtroActivo === cat ? "activo" : ""
                }`}
                onClick={() => setFiltroActivo(cat)}
              >
                {cat}
              </button>
            )
          )}
        </div>

        <div className="lista-tareas">
          {cargando ? (
            <div>Cargando tareas...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            ordenarTareas(tareasFiltradas).map((tarea) => (
              <div
                key={tarea._id}
                className="tarea-item"
                style={{
                  backgroundColor: colorEstado[tarea.estado] || "#f0f0f0",
                }}
              >
                <div className="tarea-header">
                  <strong>{tarea.titulo}</strong> - {tarea.categoria}
                </div>
                <div className="tarea-detalles">
                  📅 Fecha objetivo:{" "}
                  {new Date(tarea.fechaObjetivo).toLocaleString("es-AR", {
                    timeZone: "America/Argentina/Buenos_Aires",
                    hour12: false,
                  })}
                </div>
                <div className="tarea-detalles">
                  🔔 Estado: <strong>{tarea.estado}</strong>
                </div>
                <div className="botonesTareas">
                  <button
                    className="eliminar"
                    onClick={() => handleEliminar(tarea._id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="editar"
                    onClick={() => {
                      setFormulario({
                        titulo: tarea.titulo,
                        categoria: tarea.categoria,
                        telefono: tarea.telefono,
                        fechaObjetivo: tarea.fechaObjetivo.split("T")[0],
                        horaObjetivo: new Date(
                          tarea.fechaObjetivo
                        ).toLocaleTimeString("es-AR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                          timeZone: "America/Argentina/Buenos_Aires",
                        }),
                      });
                      setModoEdicion(true);
                      setIdEditando(tarea._id);
                    }}
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;