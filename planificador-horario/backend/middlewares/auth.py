# backend/middlewares/auth.py
# backend/middlewares/auth.py

import jwt
from flask import request, jsonify
from functools import wraps
import os
from dotenv import load_dotenv

# Cargar variables desde .env
load_dotenv()

# Obtener clave secreta
SECRET_KEY = os.getenv("SECRET_KEY")

# Middleware para proteger rutas
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Buscar el token en los headers
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]  # Bearer <token>

        if not token:
            return jsonify({'mensaje': 'Token requerido'}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user_data = data
        except jwt.ExpiredSignatureError:
            return jsonify({'mensaje': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'mensaje': 'Token inválido'}), 401

        return f(*args, **kwargs)
    return decorated
