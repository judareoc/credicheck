
import os
from pathlib import Path

import psycopg
from dotenv import load_dotenv

# Ruta exacta del archivo .env ubicado en backend
ENV_PATH = Path(__file__).resolve().parent / ".env"

# Cargar las variables del proyecto, incluso si existen otras en Windows
load_dotenv(dotenv_path=ENV_PATH, override=True)


def connect():
    database_url = os.getenv("DATABASE_URL")

    if not database_url:
        raise RuntimeError("No se encontró DATABASE_URL en backend/.env")

    return psycopg.connect(
        database_url,
        connect_timeout=5
    )
