"use client";

import { useEffect, useMemo, useState } from "react";
import { api, getToken, getUser } from "../../lib/api";

const usuariosIniciales = [
  {
    id: 1,
    nombre: "María Fernanda López",
    correo: "maria@gmail.com",
    rol: "cliente",
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Carlos Andrés Pérez",
    correo: "carlos@gmail.com",
    rol: "cliente",
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Laura Gómez",
    correo: "laura@gmail.com",
    rol: "admin",
    estado: "Activo",
  },
];

const formatoCOP = (valor) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(valor || 0));

export default function Admin() {
  const [resumen, setResumen] = useState(null);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [usuarios, setUsuarios] = useState(usuariosIniciales);

  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  const [seccion, setSeccion] = useState("dashboard");
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("todos");

  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    nombre: "",
    correo: "",
    rol: "cliente",
  });

  useEffect(() => {
    if (!getToken()) {
      window.location.href = "/login";
      return;
    }

    if (getUser()?.rol !== "admin") {
      setError("Acceso denegado: esta sección es exclusiva del administrador.");
      setCargando(false);
      return;
    }

    Promise.all([api("/admin/resumen"), api("/admin/evaluaciones")])
      .then(([datosResumen, datosEvaluaciones]) => {
        setResumen(datosResumen);
        setEvaluaciones(datosEvaluaciones);
      })
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((usuario) => {
      const coincideBusqueda =
        usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        usuario.correo.toLowerCase().includes(busqueda.toLowerCase());

      const coincideRol = filtroRol === "todos" || usuario.rol === filtroRol;

      return coincideBusqueda && coincideRol;
    });
  }, [usuarios, busqueda, filtroRol]);

  const abrirCrear = () => {
    setEditando(null);
    setFormulario({
      nombre: "",
      correo: "",
      rol: "cliente",
    });
    setModal(true);
  };

  const abrirEditar = (usuario) => {
    setEditando(usuario.id);
    setFormulario({
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
    });
    setModal(true);
  };

  const guardarUsuario = (e) => {
    e.preventDefault();

    if (!formulario.nombre.trim() || !formulario.correo.trim()) {
      return;
    }

    if (
      usuarios.some(
        (u) =>
          u.correo.toLowerCase() === formulario.correo.toLowerCase() &&
          u.id !== editando,
      )
    ) {
      alert("Ya existe un usuario con ese correo.");
      return;
    }

    if (editando !== null) {
      setUsuarios((actuales) =>
        actuales.map((u) => (u.id === editando ? { ...u, ...formulario } : u)),
      );
    } else {
      const nuevo = {
        id: Date.now(),
        ...formulario,
        estado: "Activo",
      };

      setUsuarios((actuales) => [...actuales, nuevo]);
    }

    setModal(false);
  };

  const cambiarEstado = (id) => {
    setUsuarios((actuales) =>
      actuales.map((u) =>
        u.id === id
          ? {
              ...u,
              estado: u.estado === "Activo" ? "Inactivo" : "Activo",
            }
          : u,
      ),
    );
  };

  const eliminarUsuario = (id) => {
    const confirmar = window.confirm(
      "¿Deseas retirar este usuario de la tabla de demostración?",
    );

    if (confirmar) {
      setUsuarios((actuales) => actuales.filter((u) => u.id !== id));
    }
  };

  const metricas = [
    {
      titulo: "Usuarios registrados",
      valor: resumen?.usuarios ?? usuarios.length,
      icono: "👥",
      color: "#eaf2ff",
    },
    {
      titulo: "Evaluaciones",
      valor: resumen?.evaluaciones ?? evaluaciones.length,
      icono: "📋",
      color: "#e9f8f4",
    },
    {
      titulo: "Perfiles favorables",
      valor: resumen?.favorables ?? 0,
      icono: "✓",
      color: "#eff8e9",
    },
    {
      titulo: "Registros del sector",
      valor: resumen?.filas_estadisticas_sector ?? 0,
      icono: "📊",
      color: "#f4edff",
    },
  ];

  if (cargando) {
    return (
      <main className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="mt-3 text-secondary">Cargando administrador...</p>
        </div>
      </main>
    );
  }

  if (error && !resumen) {
    return (
      <main className="container py-5">
        <div className="alert alert-warning">{error}</div>
        <a href="/" className="btn btn-outline-primary">
          Volver al inicio
        </a>
      </main>
    );
  }

  return (
    <main className="admin-page">
      {/* BARRA SUPERIOR */}
      <header className="admin-topbar">
        <div className="container-fluid px-4">
          <div className="d-flex justify-content-between align-items-center">
            <a href="/" className="admin-brand">
              CREDI<span>CHECK</span>
              <small>ADMINISTRACIÓN</small>
            </a>

            <div className="d-flex align-items-center gap-3">
              <span className="admin-online">
                <span /> Sistema activo
              </span>

              <div className="admin-avatar">
                {(getUser()?.nombre || "A").charAt(0).toUpperCase()}
              </div>

              <div className="d-none d-md-block">
                <strong className="d-block small">
                  {getUser()?.nombre || "Administrador"}
                </strong>
                <span className="text-secondary small">Administrador</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container-fluid px-3 px-lg-4 py-4">
        <div className="row g-4">
          {/* SIDEBAR */}
          <aside className="col-lg-2">
            <div className="admin-sidebar">
              <span className="admin-menu-title">MENÚ PRINCIPAL</span>

              {[
                ["dashboard", "▦", "Dashboard"],
                ["usuarios", "♙", "Usuarios"],
                ["evaluaciones", "▤", "Evaluaciones"],
                ["estadisticas", "▥", "Estadísticas"],
              ].map(([id, icono, titulo]) => (
                <button
                  key={id}
                  onClick={() => setSeccion(id)}
                  className={`admin-nav-item ${seccion === id ? "active" : ""}`}
                >
                  <span>{icono}</span>
                  {titulo}
                </button>
              ))}

              <div className="admin-sidebar-bottom">
                <a href="/" className="admin-nav-item">
                  <span>⌂</span>
                  Volver al sitio
                </a>
              </div>
            </div>
          </aside>

          {/* CONTENIDO */}
          <section className="col-lg-10">
            {error && <div className="alert alert-warning">{error}</div>}

            {/* DASHBOARD */}
            {seccion === "dashboard" && (
              <>
                <div className="admin-heading mb-4">
                  <div>
                    <span className="hero-kicker">CENTRO DE CONTROL</span>
                    <h1>Panel administrativo</h1>
                    <p>Resumen general de la plataforma CrediCheck.</p>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  {metricas.map((m) => (
                    <div className="col-6 col-xl-3" key={m.titulo}>
                      <div className="admin-metric">
                        <div
                          className="admin-metric-icon"
                          style={{ background: m.color }}
                        >
                          {m.icono}
                        </div>
                        <span>{m.titulo}</span>
                        <strong>
                          {Number(m.valor).toLocaleString("es-CO")}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="admin-content-card mb-4">
                  <h2>Estadísticas agregadas de tarjetas</h2>
                  <div className="admin-total">
                    {Number(resumen?.tarjetas_reportadas || 0).toLocaleString(
                      "es-CO",
                    )}
                  </div>
                  <p>
                    Total reportado en la fuente Excel importada. No representa
                    expedientes personales ni probabilidades de aprobación.
                  </p>
                </div>

                <div className="admin-content-card">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>Evaluaciones recientes</h2>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setSeccion("evaluaciones")}
                    >
                      Ver todas
                    </button>
                  </div>

                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Usuario</th>
                          <th>Correo</th>
                          <th>Disponible</th>
                          <th>Clasificación</th>
                        </tr>
                      </thead>
                      <tbody>
                        {evaluaciones.slice(0, 5).map((x) => (
                          <tr key={x.id}>
                            <td>{x.id}</td>
                            <td>{x.nombre}</td>
                            <td>{x.correo}</td>
                            <td>{formatoCOP(x.disponible)}</td>
                            <td>
                              <span
                                className={`status-pill status-${x.clasificacion}`}
                              >
                                {x.clasificacion?.replaceAll("_", " ")}
                              </span>
                            </td>
                          </tr>
                        ))}

                        {evaluaciones.length === 0 && (
                          <tr>
                            <td colSpan="5" className="text-center py-4">
                              No hay evaluaciones registradas.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* USUARIOS */}
            {seccion === "usuarios" && (
              <>
                <div className="admin-heading mb-4">
                  <div>
                    <span className="hero-kicker">GESTIÓN DE CUENTAS</span>
                    <h1>Usuarios</h1>
                    <p>Administra los usuarios y sus roles en la plataforma.</p>
                  </div>

                  <button
                    className="btn admin-primary-btn"
                    onClick={abrirCrear}
                  >
                    + Crear usuario
                  </button>
                </div>

                <div className="admin-content-card">
                  <div className="row g-3 mb-4">
                    <div className="col-md-8">
                      <input
                        className="form-control admin-input"
                        placeholder="Buscar por nombre o correo..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                      />
                    </div>

                    <div className="col-md-4">
                      <select
                        className="form-select admin-input"
                        value={filtroRol}
                        onChange={(e) => setFiltroRol(e.target.value)}
                      >
                        <option value="todos">Todos los roles</option>
                        <option value="admin">Administrador</option>
                        <option value="cliente">Cliente</option>
                      </select>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <h2>Listado de usuarios</h2>
                    <span className="admin-count">
                      {usuariosFiltrados.length} registros
                    </span>
                  </div>

                  <div className="table-responsive">
                    <table className="table align-middle admin-table">
                      <thead>
                        <tr>
                          <th>Usuario</th>
                          <th>Correo electrónico</th>
                          <th>Rol</th>
                          <th>Estado</th>
                          <th className="text-end">Acciones</th>
                        </tr>
                      </thead>

                      <tbody>
                        {usuariosFiltrados.map((usuario) => (
                          <tr key={usuario.id}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div className="user-avatar">
                                  {usuario.nombre.charAt(0).toUpperCase()}
                                </div>
                                <strong>{usuario.nombre}</strong>
                              </div>
                            </td>

                            <td>{usuario.correo}</td>

                            <td>
                              <span className={`role-badge ${usuario.rol}`}>
                                {usuario.rol === "admin"
                                  ? "Administrador"
                                  : "Cliente"}
                              </span>
                            </td>

                            <td>
                              <span
                                className={`user-status ${
                                  usuario.estado === "Activo"
                                    ? "activo"
                                    : "inactivo"
                                }`}
                              >
                                {usuario.estado}
                              </span>
                            </td>

                            <td>
                              <div className="d-flex justify-content-end gap-2">
                                <button
                                  className="admin-action edit"
                                  title="Editar"
                                  onClick={() => abrirEditar(usuario)}
                                >
                                  ✎
                                </button>

                                <button
                                  className="admin-action toggle"
                                  title="Cambiar estado"
                                  onClick={() => cambiarEstado(usuario.id)}
                                >
                                  {usuario.estado === "Activo" ? "⊘" : "✓"}
                                </button>

                                <button
                                  className="admin-action delete"
                                  title="Eliminar de demostración"
                                  onClick={() => eliminarUsuario(usuario.id)}
                                >
                                  ×
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}

                        {usuariosFiltrados.length === 0 && (
                          <tr>
                            <td colSpan="5" className="text-center py-5">
                              No se encontraron usuarios.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* EVALUACIONES */}
            {seccion === "evaluaciones" && (
              <>
                <div className="admin-heading mb-4">
                  <div>
                    <span className="hero-kicker">CONTROL FINANCIERO</span>
                    <h1>Evaluaciones</h1>
                    <p>Consulta las simulaciones realizadas.</p>
                  </div>
                </div>

                <div className="admin-content-card">
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Usuario</th>
                          <th>Correo</th>
                          <th>Disponible</th>
                          <th>Clasificación</th>
                        </tr>
                      </thead>

                      <tbody>
                        {evaluaciones.map((x) => (
                          <tr key={x.id}>
                            <td>{x.id}</td>
                            <td>{x.nombre}</td>
                            <td>{x.correo}</td>
                            <td>{formatoCOP(x.disponible)}</td>
                            <td>
                              <span
                                className={`status-pill status-${x.clasificacion}`}
                              >
                                {x.clasificacion?.replaceAll("_", " ")}
                              </span>
                            </td>
                          </tr>
                        ))}

                        {evaluaciones.length === 0 && (
                          <tr>
                            <td colSpan="5" className="text-center py-4">
                              No hay evaluaciones registradas.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ESTADÍSTICAS */}
            {seccion === "estadisticas" && (
              <>
                <div className="admin-heading mb-4">
                  <div>
                    <span className="hero-kicker">INFORMACIÓN DEL SECTOR</span>
                    <h1>Estadísticas</h1>
                    <p>Datos agregados importados desde Excel.</p>
                  </div>
                </div>

                <div className="admin-content-card">
                  <h2>Información disponible</h2>

                  <div className="row g-4 mt-2">
                    <div className="col-md-6">
                      <div className="admin-stat-box">
                        <span>Registros importados</span>
                        <strong>
                          {Number(
                            resumen?.filas_estadisticas_sector || 0,
                          ).toLocaleString("es-CO")}
                        </strong>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="admin-stat-box">
                        <span>Total de tarjetas reportadas</span>
                        <strong>
                          {Number(
                            resumen?.tarjetas_reportadas || 0,
                          ).toLocaleString("es-CO")}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <p className="text-secondary small mt-4 mb-0">
                    Estos datos son agregados y no corresponden a información
                    individual de solicitantes.
                  </p>
                </div>
              </>
            )}
          </section>
        </div>
      </div>

      {/* MODAL CREAR / EDITAR */}
      {modal && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <span className="hero-kicker">GESTIÓN DE USUARIOS</span>
                <h2>
                  {editando !== null ? "Editar usuario" : "Crear usuario"}
                </h2>
              </div>

              <button
                className="admin-modal-close"
                onClick={() => setModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={guardarUsuario}>
              <div className="mb-3">
                <label className="form-label">Nombre completo</label>
                <input
                  className="form-control admin-input"
                  value={formulario.nombre}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      nombre: e.target.value,
                    })
                  }
                  placeholder="Ej. Juan Pérez"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control admin-input"
                  value={formulario.correo}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      correo: e.target.value,
                    })
                  }
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Rol del usuario</label>
                <select
                  className="form-select admin-input"
                  value={formulario.rol}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      rol: e.target.value,
                    })
                  }
                >
                  <option value="cliente">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setModal(false)}
                >
                  Cancelar
                </button>

                <button type="submit" className="btn admin-primary-btn">
                  {editando !== null ? "Guardar cambios" : "Crear usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
