"use client";
import { useEffect, useState } from "react";
import { api, getToken } from "../../lib/api";
export default function Evaluar() {
  const [f, F] = useState({
    ingresos: "",
    gastos: "",
    obligaciones: "",
    antiguedad_meses: "",
    situacion_laboral: "empleado",
  });
  const [r, R] = useState(null);
  const [e, E] = useState("");
  const [b, B] = useState(false);
  useEffect(() => {
    if (!getToken()) location.href = "/login";
  }, []);
  function change(x) {
    F({ ...f, [x.target.name]: x.target.value });
  }
  async function submit(x) {
    x.preventDefault();
    E("");
    R(null);
    B(true);
    try {
      R(
        await api("/evaluaciones", {
          method: "POST",
          body: JSON.stringify({
            ...f,
            ingresos: Number(f.ingresos),
            gastos: Number(f.gastos),
            obligaciones: Number(f.obligaciones),
            antiguedad_meses: Number(f.antiguedad_meses),
          }),
        }),
      );
    } catch (err) {
      E(err.message);
      if (err.status === 401) location.href = "/login";
    } finally {
      B(false);
    }
  }
  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <span className="hero-kicker">EVALUACIÓN FINANCIERA</span>
          <h1 className="section-title display-6 mt-2">Evalúa tu perfil</h1>
          <p className="text-secondary">
            Registra valores mensuales en pesos colombianos (COP).
          </p>
          <div className="dashboard-card p-4 p-md-5">
            <form onSubmit={submit}>
              <div className="row g-3">
                {[
                  ["ingresos", "Ingresos mensuales (COP)"],
                  ["gastos", "Gastos mensuales (COP)"],
                  ["obligaciones", "Obligaciones mensuales (COP)"],
                  ["antiguedad_meses", "Antigüedad laboral (meses)"],
                ].map(([name, label]) => (
                  <div className="col-md-6" key={name}>
                    <label className="form-label">{label}</label>
                    <input
                      className="form-control"
                      name={name}
                      type="number"
                      min="0"
                      value={f[name]}
                      onChange={change}
                      required
                    />
                  </div>
                ))}
                <div className="col-12">
                  <label className="form-label">Situación laboral</label>
                  <select
                    className="form-select"
                    name="situacion_laboral"
                    value={f.situacion_laboral}
                    onChange={change}
                  >
                    <option value="empleado">Empleado</option>
                    <option value="independiente">Independiente</option>
                    <option value="pensionado">Pensionado</option>
                    <option value="desempleado">Desempleado</option>
                  </select>
                </div>
              </div>
              <button
                className="btn btn-primary btn-lg w-100 mt-4"
                disabled={b}
              >
                {b ? "Evaluando…" : "Generar evaluación"}
              </button>
            </form>
            {e && <div className="alert alert-danger mt-4">{e}</div>}
            {r && (
              <div className="alert alert-light border mt-4">
                <div className="d-flex justify-content-between flex-wrap">
                  <h2 className="h5 fw-bold">Resultado orientativo</h2>
                  <span className={`status-pill status-${r.clasificacion}`}>
                    {r.clasificacion.replace("_", " ")}
                  </span>
                </div>
                <p>{r.explicacion}</p>
                <strong>
                  Disponible estimado:{" "}
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    maximumFractionDigits: 0,
                  }).format(r.disponible)}
                </strong>
                <p className="small text-secondary mt-3 mb-0">{r.aviso}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
