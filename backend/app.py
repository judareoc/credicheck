import os, re
from decimal import Decimal, InvalidOperation
from flask import Flask, request, jsonify, g, redirect
from flask_cors import CORS
from dotenv import load_dotenv
from flasgger import Swagger
from db import connect
from security import hash_password, verify_password, token_for, require_auth
from modelo import evaluar

load_dotenv()
app=Flask(__name__)
CORS(app,resources={r"/api/*":{"origins":os.getenv("FRONTEND_ORIGIN","http://localhost:3000")}})
app.config["SWAGGER"]={"title":"CrediCheck API","uiversion":3}
Swagger(app, template_file="openapi.yml")

@app.get("/api/health")
def health(): return jsonify(status="ok",service="CrediCheck API")

@app.post("/api/registro")
def registro():
    d=request.get_json(silent=True) or {}
    nombre=str(d.get("nombre","")).strip()[:120]; correo=str(d.get("correo","")).strip().lower()
    password=d.get("password","")

    if len(nombre) < 2 or not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", correo):
        return jsonify(error="Nombre o correo no válido"), 400
    if not isinstance(password,str) or len(password)<10: return jsonify(error="Contraseña: mínimo 10 caracteres"),400
    try:
        with connect() as conn:
            with conn.cursor() as cur:
                cur.execute("INSERT INTO usuarios(nombre,correo,contrasena_hash,rol) VALUES(%s,%s,%s,'cliente') RETURNING id,nombre,correo,rol",(nombre,correo,hash_password(password)))
                u=cur.fetchone()
        return jsonify(usuario={"id":u[0],"nombre":u[1],"correo":u[2],"rol":u[3]}),201
    except Exception as exc:
        if "unique" in str(exc).lower(): return jsonify(error="El correo ya está registrado"),409
        app.logger.exception("registro"); return jsonify(error="No fue posible registrar"),500

@app.post("/api/login")
def login():
    d=request.get_json(silent=True) or {}; correo=str(d.get("correo","")).strip().lower(); password=d.get("password","")
    with connect() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id,nombre,correo,contrasena_hash,rol,activo FROM usuarios WHERE correo=%s",(correo,))
            u=cur.fetchone()
    if not u or not u[5] or not verify_password(password,u[3]): return jsonify(error="Credenciales incorrectas"),401
    user={"id":u[0],"nombre":u[1],"correo":u[2],"rol":u[4]}
    return jsonify(token=token_for(user),usuario=user,expira_en=3600)

@app.get("/api/me")
@require_auth()
def me(): return jsonify(id=g.user["sub"],nombre=g.user["nombre"],rol=g.user["rol"])

@app.post("/api/evaluaciones")
@require_auth()
def crear_evaluacion():
    d=request.get_json(silent=True) or {}
    try:
        ingresos=Decimal(str(d.get("ingresos"))); gastos=Decimal(str(d.get("gastos")))
        obligaciones=Decimal(str(d.get("obligaciones"))); antiguedad=int(d.get("antiguedad_meses"))
    except (InvalidOperation,TypeError,ValueError): return jsonify(error="Revisa los valores numéricos"),400
    situacion=d.get("situacion_laboral")
    if ingresos<=0 or gastos<0 or obligaciones<0 or antiguedad<0: return jsonify(error="Los valores deben ser válidos"),400
    if situacion not in ("empleado","independiente","pensionado","desempleado"): return jsonify(error="Situación laboral inválida"),400
    disponible,ratio,clase,motivo=evaluar(float(ingresos),float(gastos),float(obligaciones),antiguedad,situacion)
    with connect() as conn:
        with conn.cursor() as cur:
            cur.execute("""INSERT INTO evaluaciones(usuario_id,ingresos,gastos,obligaciones,antiguedad_meses,situacion_laboral,disponible,ratio_carga,clasificacion,explicacion)
            VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id,creado_en""",
            (int(g.user["sub"]),ingresos,gastos,obligaciones,antiguedad,situacion,disponible,ratio,clase,motivo))
            row=cur.fetchone()
    return jsonify(id=row[0],creado_en=row[1].isoformat(),disponible=disponible,ratio_carga=ratio,
                   clasificacion=clase,explicacion=motivo,
                   aviso="Simulación orientativa; no equivale a aprobación o rechazo."),201

@app.get("/api/evaluaciones")
@require_auth()
def historial():
    with connect() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id,ingresos,gastos,obligaciones,disponible,ratio_carga,clasificacion,explicacion,creado_en FROM evaluaciones WHERE usuario_id=%s ORDER BY creado_en DESC LIMIT 100",(int(g.user["sub"]),))
            rows=cur.fetchall()
    return jsonify([{"id":r[0],"ingresos":float(r[1]),"gastos":float(r[2]),"obligaciones":float(r[3]),"disponible":float(r[4]),"ratio_carga":float(r[5]),"clasificacion":r[6],"explicacion":r[7],"creado_en":r[8].isoformat()} for r in rows])

@app.get("/api/admin/resumen")
@require_auth(role="admin")
def admin_resumen():
    with connect() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM usuarios"); users=cur.fetchone()[0]
            cur.execute("SELECT COUNT(*) FROM evaluaciones"); total=cur.fetchone()[0]
            cur.execute("SELECT clasificacion,COUNT(*) FROM evaluaciones GROUP BY clasificacion"); counts=dict(cur.fetchall())
            cur.execute("SELECT COUNT(*),COALESCE(SUM(total_tarjetas),0) FROM estadisticas_sector"); sector=cur.fetchone()
    return jsonify(usuarios=users,evaluaciones=total,favorables=counts.get("FAVORABLE",0),
      revision=counts.get("REVISION_MANUAL",0),desfavorables=counts.get("DESFAVORABLE",0),
      filas_estadisticas_sector=sector[0],tarjetas_reportadas=int(sector[1]))

@app.get("/api/admin/evaluaciones")
@require_auth(role="admin")
def admin_evaluaciones():
    with connect() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT e.id,u.nombre,u.correo,e.clasificacion,e.disponible,e.creado_en FROM evaluaciones e JOIN usuarios u ON u.id=e.usuario_id ORDER BY e.creado_en DESC LIMIT 200")
            rows=cur.fetchall()
    return jsonify([{"id":r[0],"nombre":r[1],"correo":r[2],"clasificacion":r[3],"disponible":float(r[4]),"creado_en":r[5].isoformat()} for r in rows])

@app.get("/docs")
def docs(): return redirect("/apidocs/")

@app.get("/api/publico/estadisticas")
def estadisticas_publicas():
    conn = None

    try:
        conn = connect()

        with conn.cursor() as cur:

            # Indicadores generales
            cur.execute("""
                SELECT
                    COUNT(*) AS registros,
                    COUNT(DISTINCT nombre_entidad) AS entidades,
                    COALESCE(SUM(total_tarjetas), 0) AS tarjetas,
                    COALESCE(SUM(persona_natural), 0) AS naturales,
                    COALESCE(SUM(persona_juridica), 0) AS juridicas,
                    MAX(fecha_corte) AS ultima_fecha
                FROM estadisticas_sector
            """)

            r = cur.fetchone()

            resumen = {
                "registros": r[0],
                "entidades": r[1],
                "tarjetas": int(r[2]),
                "naturales": int(r[3]),
                "juridicas": int(r[4]),
                "ultima_fecha": str(r[5]) if r[5] else None
            }

            # Ranking de entidades
            cur.execute("""
                SELECT
                    nombre_entidad,
                    COALESCE(SUM(total_tarjetas), 0) AS tarjetas
                FROM estadisticas_sector
                GROUP BY nombre_entidad
                ORDER BY tarjetas DESC
                LIMIT 10
            """)

            entidades = [
                {
                    "nombre": row[0],
                    "tarjetas": int(row[1])
                }
                for row in cur.fetchall()
            ]

            # Evolución por fecha de corte
            cur.execute("""
                SELECT
                    fecha_corte,
                    COALESCE(SUM(total_tarjetas), 0) AS tarjetas
                FROM estadisticas_sector
                GROUP BY fecha_corte
                ORDER BY fecha_corte
            """)

            fechas = [
                {
                    "fecha": str(row[0]),
                    "tarjetas": int(row[1])
                }
                for row in cur.fetchall()
            ]

        return jsonify({
            "resumen": resumen,
            "entidades": entidades,
            "fechas": fechas
        }), 200

    except Exception as e:
        print("Error en estadísticas públicas:", e)
        return jsonify({
            "error": "No fue posible consultar las estadísticas"
        }), 500

    finally:
        if conn:
            conn.close()


if __name__=="__main__": app.run(host="127.0.0.1",port=5000,debug=True)
