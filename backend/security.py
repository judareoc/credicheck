import os, jwt
from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import request, jsonify, g
from werkzeug.security import generate_password_hash, check_password_hash

def hash_password(value): return generate_password_hash(value, method="scrypt")
def verify_password(value, hashed): return check_password_hash(hashed, value)
def token_for(user):
    now=datetime.now(timezone.utc)
    return jwt.encode({"sub":str(user["id"]),"nombre":user["nombre"],"rol":user["rol"],
                       "iat":now,"exp":now+timedelta(minutes=60)},os.environ["JWT_SECRET"],algorithm="HS256")
def require_auth(role=None):
    def deco(fn):
        @wraps(fn)
        def wrapped(*args,**kwargs):
            header=request.headers.get("Authorization","")
            if not header.startswith("Bearer "): return jsonify(error="Autenticación requerida"),401
            try: g.user=jwt.decode(header.split(" ",1)[1],os.environ["JWT_SECRET"],algorithms=["HS256"])
            except jwt.ExpiredSignatureError: return jsonify(error="Sesión expirada"),401
            except jwt.InvalidTokenError: return jsonify(error="Token inválido"),401
            if role and g.user.get("rol")!=role: return jsonify(error="Permisos insuficientes"),403
            return fn(*args,**kwargs)
        return wrapped
    return deco
