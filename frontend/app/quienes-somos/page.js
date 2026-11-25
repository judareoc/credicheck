import Tarjeta3D from "../../components/Tarjeta3D";

export default function QuienesSomosPage() {
  return (
    <main className="quienes-page">
      {/* PORTADA */}
      <section className="quienes-hero">
        <div className="container">
          <div className="row align-items-center g-5">
            {/* PRESENTACIÓN */}
            <div className="col-lg-7">
              <span className="quienes-tag">CONOCE CREDICHECK</span>

              <h1>
                Transformamos los datos en
                <span> oportunidades financieras.</span>
              </h1>

              <p className="quienes-intro">
                Somos un proyecto tecnológico enfocado en acercar la educación
                financiera a las personas mediante herramientas digitales,
                análisis de datos y simulaciones de perfil financiero.
              </p>

              <a href="/evaluar" className="btn quienes-btn">
                Evalúa tu perfil
              </a>
            </div>

            {/* TARJETA 3D */}
            <div className="col-lg-5 d-flex justify-content-center align-items-center">
              <div
                className="w-100 quienes-card-3d"
                style={{ maxWidth: "650px" }}
              >
                <Tarjeta3D />

                <p className="text-center mt-4 text-secondary">
                  Innovación · Tecnología · Finanzas
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IDENTIDAD */}
      <section className="container quienes-section">
        <div className="text-center mb-5">
          <span className="quienes-tag">NUESTRA IDENTIDAD</span>

          <h2>¿Qué es CrediCheck?</h2>

          <p className="section-description">
            Una plataforma digital que integra tecnología y análisis de
            información para facilitar la comprensión del perfil financiero.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <article className="identity-card">
              <div className="identity-icon">🎯</div>
              <h3>Nuestra misión</h3>
              <p>
                Facilitar el acceso a herramientas de orientación financiera
                mediante una plataforma intuitiva que permita comprender mejor
                el perfil económico de cada usuario.
              </p>
            </article>
          </div>

          <div className="col-md-4">
            <article className="identity-card">
              <div className="identity-icon">🚀</div>
              <h3>Nuestra visión</h3>
              <p>
                Ser una propuesta tecnológica de referencia en educación y
                orientación financiera, promoviendo el uso responsable de los
                datos y la innovación.
              </p>
            </article>
          </div>

          <div className="col-md-4">
            <article className="identity-card">
              <div className="identity-icon">🤝</div>
              <h3>Nuestro compromiso</h3>
              <p>
                Ofrecer información comprensible, experiencias digitales
                accesibles y resultados orientativos que ayuden a tomar
                decisiones más informadas.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* TECNOLOGÍA */}
      <section className="technology-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="quienes-tag">NUESTRA TECNOLOGÍA</span>

            <h2>Construido con tecnología moderna</h2>

            <p className="section-description">
              Integramos diferentes tecnologías para desarrollar una experiencia
              digital conectada y eficiente.
            </p>
          </div>

          <div className="row g-4 text-center">
            {[
              [
                "⚛️",
                "Next.js y React",
                "Construcción de interfaces y navegación.",
              ],
              [
                "🎨",
                "Bootstrap 5",
                "Diseño adaptable a diferentes dispositivos.",
              ],
              ["🐍", "Python y Flask", "Procesamiento y servicios de la API."],
              ["🗄️", "PostgreSQL", "Almacenamiento y consulta de información."],
              [
                "📊",
                "Análisis de datos",
                "Exploración de estadísticas financieras.",
              ],
              [
                "🌐",
                "Three.js",
                "Visualizaciones tridimensionales interactivas.",
              ],
            ].map((item) => (
              <div className="col-md-4 col-lg-4" key={item[1]}>
                <article className="technology-card">
                  <div className="technology-icon">{item[0]}</div>

                  <h3>{item[1]}</h3>
                  <p>{item[2]}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROPUESTA DE VALOR */}
      <section className="container quienes-section">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <span className="quienes-tag">NUESTRA PROPUESTA</span>

            <h2>Información que ayuda a comprender tu perfil.</h2>

            <p>
              CrediCheck permite realizar una simulación financiera a partir de
              la información proporcionada por el usuario. También presenta
              estadísticas agregadas del sector financiero para ofrecer contexto
              sobre el mercado.
            </p>

            <p>
              Nuestro propósito es combinar información, visualización y
              tecnología en un solo espacio.
            </p>
          </div>

          <div className="col-lg-6">
            <div className="benefits-panel">
              <div>✓ Evaluación financiera orientativa</div>
              <div>✓ Consulta de estadísticas públicas</div>
              <div>✓ Experiencia digital responsive</div>
              <div>✓ Información organizada y comprensible</div>
              <div>✓ Acceso a herramientas desde cualquier dispositivo</div>
            </div>
          </div>
        </div>
      </section>

      {/* ACLARACIÓN */}
      <section className="container pb-5">
        <div className="disclaimer-panel">
          <strong>Importante:</strong> CrediCheck es una herramienta de
          orientación y simulación académica. Sus resultados no representan una
          aprobación o rechazo real de crédito. Las decisiones de otorgamiento
          corresponden exclusivamente a las entidades financieras.
        </div>
      </section>

      {/* CIERRE */}
      <section className="quienes-cta">
        <div className="container text-center">
          <h2>Conoce tu perfil. Comprende tus posibilidades.</h2>

          <p>Explora las herramientas que CrediCheck tiene para ti.</p>

          <a href="/evaluar" className="btn quienes-btn">
            Comenzar evaluación
          </a>
        </div>
      </section>
    </main>
  );
}
