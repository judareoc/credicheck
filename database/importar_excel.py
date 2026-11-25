
"""
CrediCheck - Importador de estadísticas del sector financiero.

Lee el archivo Excel, hoja Data, y carga sus registros
en PostgreSQL, tabla estadisticas_sector.
"""

import sys
from pathlib import Path

import pandas as pd


# ============================================================
# 1. CONFIGURACIÓN DE RUTAS
# ============================================================

# Carpeta principal del proyecto
ROOT = Path(__file__).resolve().parents[1]

# Carpeta backend
BACKEND_DIR = ROOT / "backend"

# Permitir importar db.py desde backend
sys.path.insert(0, str(BACKEND_DIR))

# Utilizar la conexión centralizada del proyecto
from db import connect


# ============================================================
# 2. COLUMNAS DEL ARCHIVO EXCEL
# ============================================================

COLUMNAS_EXCEL = [
    "TIPOENTIDAD",
    "CODIGOENTIDAD",
    "NOMBREENTIDAD",
    "FECHACORTE",
    "COD_UCA",
    "NOMBRE_UCA",
    "SUBCUENTA",
    "DESCRIPCION",
    "PERSONA_NATURAL",
    "PERSONA_JURIDICA",
    "TOTAL_TARJETAS",
]


# ============================================================
# 3. CONSULTA SQL DE INSERCIÓN
# ============================================================

SQL_INSERT = """
INSERT INTO estadisticas_sector (
    tipo_entidad,
    codigo_entidad,
    nombre_entidad,
    fecha_corte,
    codigo_uca,
    nombre_uca,
    subcuenta,
    descripcion,
    persona_natural,
    persona_juridica,
    total_tarjetas
)
VALUES (
    %s, %s, %s, %s, %s, %s,
    %s, %s, %s, %s, %s
)
ON CONFLICT (
    codigo_entidad,
    fecha_corte,
    codigo_uca,
    subcuenta,
    descripcion
)
DO UPDATE SET
    tipo_entidad = EXCLUDED.tipo_entidad,
    nombre_entidad = EXCLUDED.nombre_entidad,
    nombre_uca = EXCLUDED.nombre_uca,
    persona_natural = EXCLUDED.persona_natural,
    persona_juridica = EXCLUDED.persona_juridica,
    total_tarjetas = EXCLUDED.total_tarjetas;
"""


# ============================================================
# 4. LIMPIEZA Y CONVERSIÓN DE DATOS
# ============================================================

def limpiar_valor(valor):
    """
    Convierte valores de pandas y NumPy a tipos
    compatibles con PostgreSQL.
    """

    if pd.isna(valor):
        return None

    # Convertir fechas de pandas
    if isinstance(valor, pd.Timestamp):
        return valor.date()

    # Convertir tipos NumPy a tipos nativos de Python
    if hasattr(valor, "item"):
        valor = valor.item()

    return valor


# ============================================================
# 5. IMPORTACIÓN DEL EXCEL
# ============================================================

def importar_excel(ruta_excel):

    ruta_excel = Path(ruta_excel).expanduser().resolve()

    print("\n====================================")
    print("       CREDICHECK - IMPORTADOR")
    print("====================================")

    # Verificar existencia del archivo
    if not ruta_excel.exists():
        raise FileNotFoundError(
            f"No se encontró el archivo Excel:\n{ruta_excel}"
        )

    print(f"\nArchivo encontrado: {ruta_excel.name}")

    # Leer hoja Data
    print("\nLeyendo hoja Data...")

    df = pd.read_excel(
        ruta_excel,
        sheet_name="Data",
        engine="openpyxl"
    )

    # Limpiar nombres de columnas
    df.columns = df.columns.astype(str).str.strip()

    # Validar columnas requeridas
    faltantes = [
        columna
        for columna in COLUMNAS_EXCEL
        if columna not in df.columns
    ]

    if faltantes:
        raise ValueError(
            "El Excel no contiene todas las columnas requeridas.\n"
            f"Columnas faltantes: {faltantes}\n"
            f"Columnas encontradas: {list(df.columns)}"
        )

    # Conservar únicamente las columnas necesarias
    df = df[COLUMNAS_EXCEL].copy()

    # Eliminar filas completamente vacías
    df = df.dropna(how="all")

    print(f"Registros encontrados: {len(df)}")

    if df.empty:
        print("El archivo no contiene registros para importar.")
        return

    # Convertir los registros a tipos compatibles
    registros = []

    for fila in df.itertuples(index=False, name=None):
        registro = tuple(
            limpiar_valor(valor)
            for valor in fila
        )
        registros.append(registro)

    # ========================================================
    # 6. CONEXIÓN E INSERCIÓN EN POSTGRESQL
    # ========================================================

    print("\nConectando con PostgreSQL...")

    insertados = 0

    with connect() as conn:

        print("Conexión exitosa.")
        print(f"Base de datos: {conn.info.dbname}")

        with conn.cursor() as cursor:

            print("\nInsertando registros...")

            cursor.executemany(
                SQL_INSERT,
                registros
            )

            insertados = len(registros)

        # La conexión confirma la transacción al salir
        # correctamente del bloque with.

    # ========================================================
    # 7. RESULTADO FINAL
    # ========================================================

    print("\n====================================")
    print("       IMPORTACIÓN FINALIZADA")
    print("====================================")
    print(f"Registros procesados: {insertados}")
    print("Tabla destino: estadisticas_sector")
    print("Base de datos: credicheck")
    print("Estado: EXITOSO")
    print("====================================\n")


# ============================================================
# 8. EJECUCIÓN PRINCIPAL
# ============================================================

if __name__ == "__main__":

    if len(sys.argv) < 2:
        print(
            "\nUso correcto:\n"
            'python database/importar_excel.py "ruta_archivo.xlsx"\n'
        )
        sys.exit(1)

    try:
        importar_excel(sys.argv[1])

    except Exception as error:
        print("\nERROR DURANTE LA IMPORTACIÓN")
        print("------------------------------------")
        print(f"Detalle: {error}")
        sys.exit(1)
