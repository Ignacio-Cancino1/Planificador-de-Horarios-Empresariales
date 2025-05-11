import jwt
from flask import request, jsonify
from functools import wraps

SECRET_KEY = "clave-secreta-supersegura"  # Usa tu clave real y guárdala en .env en producción

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Permitir solicitudes OPTIONS para CORS
        if request.method == 'OPTIONS':
            return '', 200

        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({'error': 'Token faltante'}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.usuario = data  # almacena el usuario decodificado para acceso posterior
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token inválido'}), 401

        return f(*args, **kwargs)

    return decorated


def admin_required(f):
    @wraps(f)
    @token_required
    def decorated(*args, **kwargs):
        usuario = getattr(request, 'usuario', None)
        if not usuario or usuario.get('rol') != 'admin':
            return jsonify({'error': 'Acceso restringido a administradores'}), 403
        return f(*args, **kwargs)
    return decorated
