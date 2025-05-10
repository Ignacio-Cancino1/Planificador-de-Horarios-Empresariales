import jwt
from flask import request, jsonify
from functools import wraps

# 🔐 Clave secreta para firmar y verificar tokens (puedes cargarla desde config si prefieres)
SECRET_KEY = "tu_clave_super_secreta"

# ✅ Verifica que el token JWT esté presente y válido
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'Authorization' in request.headers:
            try:
                token = request.headers['Authorization'].split(" ")[1]
                data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
                request.user_data = data
            except jwt.ExpiredSignatureError:
                return jsonify({'mensaje': 'Token expirado'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'mensaje': 'Token inválido'}), 401
        else:
            return jsonify({'mensaje': 'Token requerido'}), 401

        return f(*args, **kwargs)
    return decorated

# 🔐 Verifica que el usuario autenticado tenga rol 'admin'
def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'Authorization' in request.headers:
            try:
                token = request.headers['Authorization'].split(" ")[1]
                data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
                if data.get("rol") != "admin":
                    return jsonify({'error': 'Solo los administradores pueden acceder'}), 403
                request.user_data = data
            except jwt.ExpiredSignatureError:
                return jsonify({'mensaje': 'Token expirado'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'mensaje': 'Token inválido'}), 401
        else:
            return jsonify({'mensaje': 'Token requerido'}), 401

        return f(*args, **kwargs)
    return decorated
