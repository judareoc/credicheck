"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { clearSession, getUser } from "../lib/api";
export default function Menu() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const sync = () => setUser(getUser());
    sync();
    window.addEventListener("cc-session", sync);
    return () => window.removeEventListener("cc-session", sync);
  }, []);
  function salir() {
    clearSession();
    setUser(null);
    window.dispatchEvent(new Event("cc-session"));
    location.href = "/";
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-cc sticky-top">
      <div className="container py-1">
        <Link className="navbar-brand fw-bold" href="/">
          <span className="brand-mark">C</span>CrediCheck
        </Link>
        <button
          className="navbar-toggler"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <Link className="nav-link" href="/">
              Inicio
            </Link>
            {user && (
              <>
                <Link className="nav-link" href="/evaluar">
                  Evaluar perfil
                </Link>
                <Link className="nav-link" href="/estadisticas">
                  Estadísticas públicas
                </Link>
                <Link className="nav-link" href="/historial">
                  Mi historial
                </Link>
              </>
            )}
            {user?.rol === "admin" && (
              <Link className="nav-link" href="/admin">
                Administración
              </Link>
            )}
            {!user ? (
              <>
                <Link className="nav-link" href="/login">
                  Iniciar sesión
                </Link>
                <Link className="nav-link" href="/estadisticas">
                  Estadísticas públicas
                </Link>
                <Link className="btn btn-aqua btn-sm px-3" href="/registro">
                  Crear cuenta
                </Link>
              </>
            ) : (
              <button className="btn btn-outline-light btn-sm" onClick={salir}>
                Salir · {user.nombre}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
