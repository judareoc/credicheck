CREATE TABLE IF NOT EXISTS usuarios (
 id BIGSERIAL PRIMARY KEY, nombre VARCHAR(120) NOT NULL,
 correo VARCHAR(180) UNIQUE NOT NULL, contrasena_hash TEXT NOT NULL,
 rol VARCHAR(20) NOT NULL DEFAULT 'cliente' CHECK (rol IN ('admin','cliente')),
 activo BOOLEAN NOT NULL DEFAULT TRUE, creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS evaluaciones (
 id BIGSERIAL PRIMARY KEY, usuario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
 ingresos NUMERIC(14,2) NOT NULL CHECK(ingresos>0),
 gastos NUMERIC(14,2) NOT NULL CHECK(gastos>=0),
 obligaciones NUMERIC(14,2) NOT NULL CHECK(obligaciones>=0),
 antiguedad_meses INTEGER NOT NULL CHECK(antiguedad_meses>=0),
 situacion_laboral VARCHAR(30) NOT NULL, disponible NUMERIC(14,2) NOT NULL,
 ratio_carga NUMERIC(7,4) NOT NULL,
 clasificacion VARCHAR(30) NOT NULL CHECK(clasificacion IN ('FAVORABLE','REVISION_MANUAL','DESFAVORABLE')),
 explicacion TEXT NOT NULL, creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_eval_user ON evaluaciones(usuario_id,creado_en DESC);
CREATE TABLE IF NOT EXISTS estadisticas_sector (
 id BIGSERIAL PRIMARY KEY, tipo_entidad INTEGER, codigo_entidad INTEGER,
 nombre_entidad VARCHAR(200), fecha_corte DATE, codigo_uca INTEGER,
 nombre_uca VARCHAR(150), subcuenta INTEGER, descripcion TEXT,
 persona_natural BIGINT, persona_juridica BIGINT, total_tarjetas BIGINT,
 UNIQUE(codigo_entidad,fecha_corte,codigo_uca,subcuenta,descripcion)
);
