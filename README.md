# CrediCheck Web
Stack según la guía: Next.js 16 + React 19 + Bootstrap 5.3 + Three.js; API Flask + JWT; PostgreSQL; Swagger.
La hoja Excel aportada es estadística agregada de tarjetas por entidad/fecha/franquicia, no contiene solicitantes individuales. Se importa a `estadisticas_sector` para indicadores administrativos, nunca para inferir aprobación individual.

## Requisitos
Node.js 20.9+, Python 3.11+, PostgreSQL 14+.

## Base de datos
`CREATE DATABASE credicheck;` y ejecutar `database/schema.sql`.

## Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```
Copiar `.env.example` a `.env`, ajustar credenciales, ejecutar `python seed_admin.py` y `python app.py`.
API: http://localhost:5000 · Swagger: http://localhost:5000/apidocs/

## Frontend
```bash
cd frontend
npm install
```
Copiar `.env.local.example` a `.env.local`, ejecutar `npm run dev`.
Web: http://localhost:3000

## Importar Excel
```bash
pip install pandas openpyxl "psycopg[binary]" python-dotenv
python database/importar_excel.py "ruta/al/archivo.xlsx"
```

## Roles
Registro público crea `cliente`. El administrador se crea con `seed_admin.py`. JWT dura 60 minutos. El backend devuelve 401 sin token y 403 cuando el rol no está autorizado.
El panel admin no se protege solo ocultando enlaces: todos sus endpoints validan JWT y rol en Flask.

## Alcance
Las reglas son demostrativas y transparentes; no consultan centrales de riesgo ni aprueban/rechazan tarjetas. Antes de producción: revisión legal, consentimiento y política de privacidad, HTTPS, rate limiting, auditoría, gestión segura de secretos y pruebas de seguridad.
