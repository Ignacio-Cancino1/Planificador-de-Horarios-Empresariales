# backend/routes/usuarios.py

from flask import Blueprint, request, jsonify
from models.models import db, Usuario, Empleado
import bcrypt
import jwt
import datetime
from middlewares.auth import SECRET_KEY

usuarios_bp = Blueprint('usuarios', __name__)

# REGISTRO
@usuarios_bp.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    rut = data.get('rut')
    password = data.get('password')
    rol = data.get('rol')
    id_empleado = data.get('id_empleado')

    if not all([email, password, rol, id_empleado]):
        return jsonify({'error': 'Faltan campos obligatorios'}), 400

    # Verificar si el usuario ya existe
    if Usuario.query.filter((Usuario.email == email) | (Usuario.rut == rut)).first():
        return jsonify({'error': 'Usuario ya existe'}), 400

    # Hash de contraseña
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    nuevo_usuario = Usuario(
        email=email,
        rut=rut,
        password_hash=hashed.decode('utf-8'),
        rol=rol,
        id_empleado=id_empleado,
        requiere_cambio_clave=True  # ✅ se fuerza el cambio en el primer inicio
    )
    db.session.add(nuevo_usuario)
    db.session.commit()

    return jsonify({'mensaje': 'Usuario registrado exitosamente'}), 201


# LOGIN
@usuarios_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email_or_rut = data.get('login')
    password = data.get('password')

    try:
        # Buscar por email o RUT
        usuario = Usuario.query.filter(
            (Usuario.email == email_or_rut) | (Usuario.rut == email_or_rut)
        ).first()

        if not usuario or not bcrypt.checkpw(password.encode('utf-8'), usuario.password_hash.encode('utf-8')):
            return jsonify({'error': 'Credenciales inválidas'}), 401

        # Crear el token JWT
        token = jwt.encode({
            'id_usuario': usuario.id_usuario,
            'id_empleado': usuario.id_empleado,
            'rol': usuario.rol,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        }, SECRET_KEY, algorithm="HS256")

        # ✅ Log para verificar valor
        print("🧪 REQUIERE CAMBIO:", usuario.requiere_cambio_clave)
        return jsonify({
            'mensaje': 'Inicio de sesión exitoso',
            'rol': usuario.rol,
            'id_usuario': usuario.id_usuario,
            'id_empleado': usuario.id_empleado,
            'requiere_cambio_clave': usuario.requiere_cambio_clave,  # ✅ importante
            'token': token
        })

    except Exception as e:
        print("❌ ERROR en login:", str(e))
        return jsonify({'error': 'Error interno en el servidor'}), 500


# CAMBIO DE CONTRASEÑA
@usuarios_bp.route('/api/usuarios/<int:id_usuario>/cambiar-clave', methods=['PUT'])
def cambiar_clave(id_usuario):
    data = request.get_json()
    nueva_clave = data.get('nueva_clave')

    if not nueva_clave:
        return jsonify({'error': 'La nueva contraseña es obligatoria'}), 400

    usuario = Usuario.query.get(id_usuario)
    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    usuario.password_hash = bcrypt.hashpw(nueva_clave.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    usuario.requiere_cambio_clave = False  # ✅ desactiva el requerimiento
    db.session.commit()

    return jsonify({'mensaje': 'Contraseña actualizada correctamente'})
