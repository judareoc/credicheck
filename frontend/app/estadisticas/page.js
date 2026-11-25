"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

const formato = (valor) => new Intl.NumberFormat("es-CO").format(valor || 0);

export default function EstadisticasPage() {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarDatos() {
      try {
        const respuesta = await fetch(`${API}/api/publico/estadisticas`, {
          cache: "no-store",
        });

        if (!respuesta.ok) {
          throw new Error("No se pudieron cargar las estadísticas");
        }

        const resultado = await respuesta.json();
        setDatos(resultado);
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);

  if (cargando) {
    return <div className="container py-5">Cargando estadísticas...</div>;
  }

  if (error || !datos) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error || "No hay información disponible"}
        </div>
      </div>
    );
  }

  const maximo = Math.max(...datos.entidades.map((e) => e.tarjetas), 1);

  return (
    <main className="container py-5">
      {/* ENCABEZADO */}
      <section className="mb-5">
        <span className="badge bg-primary mb-3">INFORMACIÓN ABIERTA</span>

        <h1 className="fw-bold">Estadísticas del sector financiero</h1>

        <p className="text-secondary">
          Consulta información agregada sobre tarjetas de crédito y débito,
          entidades financieras y comportamiento del sector.
        </p>

        <p className="small text-secondary">
          Última fecha de corte: {datos.resumen.ultima_fecha || "No disponible"}
        </p>
      </section>

      {/* INDICADORES */}
      <div className="row g-4 mb-5">
        {[
          ["Registros importados", datos.resumen.registros],
          ["Entidades financieras", datos.resumen.entidades],
          ["Total de tarjetas", datos.resumen.tarjetas],
          ["Personas naturales", datos.resumen.naturales],
          ["Personas jurídicas", datos.resumen.juridicas],
        ].map(([titulo, valor]) => (
          <div className="col-12 col-md-6 col-lg-4" key={titulo}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <p className="text-secondary mb-2">{titulo}</p>
                <h3 className="fw-bold text-primary">{formato(valor)}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RANKING DE ENTIDADES */}
      <section className="card border-0 shadow-sm mb-5">
        <div className="card-body p-4">
          <h3 className="fw-bold mb-2">Tarjetas por entidad financiera</h3>

          <p className="text-secondary">
            Comparativo de las diez entidades con mayor volumen registrado.
          </p>

          {datos.entidades.map((entidad, index) => (
            <div className="mb-4" key={entidad.nombre}>
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-semibold">
                  {index + 1}. {entidad.nombre}
                </span>

                <span>{formato(entidad.tarjetas)}</span>
              </div>

              <div className="progress" style={{ height: "12px" }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${(entidad.tarjetas / maximo) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TABLA DE ENTIDADES */}
      <section className="card border-0 shadow-sm mb-5">
        <div className="card-body p-4">
          <h3 className="fw-bold mb-4">Detalle de entidades</h3>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Entidad financiera</th>
                  <th className="text-end">Total de tarjetas</th>
                </tr>
              </thead>

              <tbody>
                {datos.entidades.map((entidad) => (
                  <tr key={entidad.nombre}>
                    <td>{entidad.nombre}</td>
                    <td className="text-end fw-semibold">
                      {formato(entidad.tarjetas)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FUENTE */}
      <div className="alert alert-light border">
        <strong>Fuente de información:</strong> base de datos estadística de
        CrediCheck, alimentada mediante la importación del archivo Excel de
        tarjetas de crédito y débito.
        <p className="small text-secondary mt-2 mb-0">
          Los datos son agregados y descriptivos. No representan información
          individual de clientes ni determinan la aprobación de créditos.
        </p>
      </div>
    </main>
  );
}
