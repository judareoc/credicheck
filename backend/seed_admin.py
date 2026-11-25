import os
from dotenv import load_dotenv
from db import connect
from security import hash_password
load_dotenv()
email=os.getenv("ADMIN_EMAIL","admin@credicheck.local")
password=os.getenv("ADMIN_PASSWORD","")
if len(password)<12: raise SystemExit("Define ADMIN_PASSWORD con al menos 12 caracteres en backend/.env")
with connect() as conn:
    with conn.cursor() as cur:
        cur.execute("INSERT INTO usuarios(nombre,correo,contrasena_hash,rol) VALUES(%s,%s,%s,'admin') ON CONFLICT(correo) DO UPDATE SET rol='admin',activo=TRUE",
                    ("Administrador CrediCheck",email,hash_password(password)))
print("Administrador configurado:",email)
