"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const Tarjeta3D = dynamic(() => import("../components/Tarjeta3D"), {
  ssr: false,
  loading: () => (
    <div className="three-wrap d-flex align-items-center justify-content-center text-white-50">
      Cargando tarjeta 3D…
    </div>
  ),
});
const PerfilFinanciero3D = dynamic(
  () => import("../components/PerfilFinanciero3D"),
  {
    ssr: false,
    loading: () => (
      <div className="profile-3d-canvas d-flex align-items-center justify-content-center text-secondary">
        Preparando visualización…
      </div>
    ),
  },
);

const beneficios = [
  {
    icon: "◉",
    title: "Conoce tu capacidad",
    text: "Organiza tus ingresos, gastos y obligaciones para comprender cuánto margen tienes en tu presupuesto.",
  },
  {
    icon: "▤",
    title: "Consulta tu historial",
    text: "Accede a tus evaluaciones anteriores y observa cómo ha evolucionado la información de tu perfil.",
  },
  {
    icon: "⌁",
    title: "Información clara",
    text: "Comprende los factores considerados y recibe una orientación explicada en un lenguaje sencillo.",
  },
];

const factores = [
  {
    number: "01",
    title: "Ingresos mensuales",
    text: "Permiten conocer los recursos que recibes y con los que atiendes tus compromisos.",
  },
  {
    number: "02",
    title: "Gastos habituales",
    text: "Ayudan a estimar cuánto dinero destinas a tus necesidades y obligaciones cotidianas.",
  },
  {
    number: "03",
    title: "Obligaciones financieras",
    text: "Consideran las cuotas y compromisos que ya hacen parte de tu presupuesto.",
  },
  {
    number: "04",
    title: "Estabilidad laboral",
    text: "Aporta contexto sobre tu situación de trabajo y la continuidad de tus ingresos.",
  },
];

const pasos = [
  [
    "1",
    "Crea tu cuenta",
    "Regístrate con tus datos básicos para tener un espacio personal.",
  ],
  [
    "2",
    "Completa tu evaluación",
    "Ingresa la información financiera solicitada de forma clara y cuidadosa.",
  ],
  [
    "3",
    "Revisa tu orientación",
    "Consulta el resultado, conoce los factores considerados y guarda tu historial.",
  ],
];

const preguntas = [
  [
    "¿CrediCheck aprueba tarjetas de crédito?",
    "No. CrediCheck ofrece una simulación orientativa basada en la información ingresada. La decisión de aprobar o rechazar una tarjeta corresponde a cada entidad financiera.",
  ],
  [
    "¿Necesito crear una cuenta?",
    "Puedes crear una cuenta para realizar evaluaciones y consultar tu historial personal dentro de la plataforma.",
  ],
  [
    "¿Qué información debo tener a mano?",
    "Ten presentes tus ingresos mensuales, gastos habituales, obligaciones financieras y situación laboral.",
  ],
  [
    "¿El resultado garantiza una aprobación?",
    "No. El resultado no representa una aprobación, una oferta de crédito ni una decisión de una entidad financiera.",
  ],
];

export default function Home() {
  return (
    <>
      {/* PORTADA PRINCIPAL */}
      <section className="hero-cc py-5">
        <div className="container py-lg-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <div className="hero-copy">
                <span className="hero-kicker">
                  TU PERFIL FINANCIERO, MÁS CLARO
                </span>
                <h1 className="mt-3">
                  Entiende tu perfil.{" "}
                  <span className="hero-highlight">Decide mejor.</span>
                </h1>
                <p className="mt-4">
                  Conoce cómo se relacionan tus ingresos, gastos y obligaciones.
                  CrediCheck te ayuda a explorar tu capacidad financiera
                  mediante una experiencia sencilla y fácil de comprender.
                </p>
                <div className="d-flex flex-wrap gap-3 mt-4">
                  <Link
                    href="/evaluar"
                    className="btn btn-aqua btn-lg px-4 py-3"
                  >
                    Evaluar perfil <span aria-hidden="true">→</span>
                  </Link>
                  <Link
                    href="/registro"
                    className="btn btn-outline-light btn-lg px-4 py-3"
                  >
                    Crear una cuenta
                  </Link>
                </div>
                <div className="d-flex flex-wrap gap-4 mt-4 small text-white-50">
                  <span>✓ Simulación orientativa</span>
                  <span>✓ Historial personal</span>
                  <span>✓ Diseño adaptable</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-visual">
                <Tarjeta3D />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="py-5">
        <div className="container py-3">
          <div className="section-heading text-center mx-auto mb-5">
            <span className="hero-kicker">¿QUÉ PUEDES HACER?</span>
            <h2 className="section-title display-6 mt-2">
              Tu información financiera, explicada de forma sencilla
            </h2>
            <p className="text-secondary">
              Una herramienta para organizar tus datos y comprender mejor tu
              situación antes de solicitar un producto financiero.
            </p>
          </div>
          <div className="row g-4">
            {beneficios.map((item) => (
              <div className="col-12 col-md-6 col-lg-4" key={item.title}>
                <article className="feature-card">
                  <div className="feature-icon">{item.icon}</div>
                  <h3 className="h5 fw-bold mt-4">{item.title}</h3>
                  <p className="text-secondary mb-0">{item.text}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEGUNDA VISUALIZACIÓN 3D EN LA MITAD DE LA PÁGINA */}
      <section className="financial-section py-5">
        <div className="container py-lg-4">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-lg-6 order-2 order-lg-1">
              <div className="financial-visual-card">
                <PerfilFinanciero3D />
                <div className="visual-caption">
                  <span className="visual-dot"></span> Modelo visual conceptual
                  del perfil financiero
                </div>
              </div>
            </div>
            <div className="col-lg-6 order-1 order-lg-2">
              <span className="hero-kicker">VISUALIZA TU INFORMACIÓN</span>
              <h2 className="section-title display-6 mt-2">
                Cada factor cuenta para entender tu capacidad financiera
              </h2>
              <p className="text-secondary mt-3">
                La visualización representa cómo distintos elementos de tus
                finanzas personales se relacionan entre sí. No es un indicador
                bancario ni un puntaje de aprobación: es una forma gráfica de
                explicar la información que introduces.
              </p>
              <div className="factor-list mt-4">
                {factores.map((factor) => (
                  <div className="factor-item" key={factor.number}>
                    <span className="factor-number">{factor.number}</span>
                    <div>
                      <h3 className="h6 fw-bold mb-1">{factor.title}</h3>
                      <p className="text-secondary mb-0">{factor.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/evaluar"
                className="btn btn-primary btn-lg px-4 mt-4"
              >
                Comenzar evaluación →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="py-5">
        <div className="container py-3">
          <div className="section-heading text-center mx-auto mb-5">
            <span className="hero-kicker">EN TRES PASOS</span>
            <h2 className="section-title display-6 mt-2">
              Empieza cuando quieras
            </h2>
            <p className="text-secondary">
              El proceso está organizado para que puedas completar tu
              información y revisar la orientación.
            </p>
          </div>
          <div className="row g-4">
            {pasos.map(([number, title, text]) => (
              <div className="col-12 col-md-4" key={number}>
                <article className="process-card h-100">
                  <span className="step-number">{number}</span>
                  <h3 className="h5 fw-bold mt-4">{title}</h3>
                  <p className="text-secondary mb-0">{text}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALCANCE Y TRANSPARENCIA */}
      <section className="section-soft py-5">
        <div className="container py-3">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="hero-kicker">TRANSPARENCIA</span>
              <h2 className="section-title display-6 mt-2">
                Una orientación para tomar decisiones con más información
              </h2>
              <p className="text-secondary mt-3 mb-0">
                CrediCheck utiliza los datos que proporciona el usuario para
                generar una orientación inicial. El resultado depende de la
                información ingresada y no reemplaza el estudio de crédito, las
                políticas ni la decisión de una entidad financiera.
              </p>
            </div>
            <div className="col-lg-5">
              <div className="notice-card">
                <div className="notice-icon">i</div>
                <h3 className="h5 fw-bold">Importante</h3>
                <p className="text-secondary mb-0">
                  No compartas contraseñas ni información bancaria sensible.
                  Ingresa únicamente los datos solicitados por la evaluación y
                  revisa las condiciones de privacidad de la plataforma.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PREGUNTAS FRECUENTES */}
      <section className="py-5">
        <div className="container py-3">
          <div className="section-heading text-center mx-auto mb-4">
            <span className="hero-kicker">RESOLVEMOS TUS DUDAS</span>
            <h2 className="section-title display-6 mt-2">
              Preguntas frecuentes
            </h2>
          </div>
          <div className="faq-list mx-auto">
            {preguntas.map(([question, answer], index) => (
              <details className="faq-item" key={question} open={index === 0}>
                <summary>{question}</summary>
                <p className="text-secondary mb-0 mt-3">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* LLAMADO FINAL */}
      <section className="closing-section py-5 text-center">
        <div className="container py-4">
          <span className="hero-kicker">COMIENZA HOY</span>
          <h2 className="display-6 fw-bold mt-2">
            Da el primer paso para conocer tu perfil
          </h2>
          <p className="closing-copy mx-auto mt-3">
            Organiza tu información, realiza una evaluación y consulta una
            orientación construida a partir de los datos que proporcionas.
          </p>
          <div className="d-flex justify-content-center flex-wrap gap-3 mt-4">
            <Link href="/evaluar" className="btn btn-aqua btn-lg px-4">
              Evaluar mi perfil →
            </Link>
            <Link
              href="/registro"
              className="btn btn-outline-light btn-lg px-4"
            >
              Crear cuenta
            </Link>
          </div>
          <p className="small text-white-50 mt-4 mb-0">
            CrediCheck es una herramienta orientativa y no garantiza la
            aprobación de una tarjeta de crédito.
          </p>
        </div>
      </section>
    </>
  );
}
