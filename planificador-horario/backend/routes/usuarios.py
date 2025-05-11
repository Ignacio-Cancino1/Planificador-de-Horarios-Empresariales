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

    if Usuario.query.filter((Usuario.email == email) | (Usuario.rut == rut)).first():
        return jsonify({'error': 'Usuario ya existe'}), 400

    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    nuevo_usuario = Usuario(
        email=email,
        rut=rut,
        password_hash=hashed.decode('utf-8'),
        rol=rol,
        id_empleado=id_empleado,
        requiere_cambio_clave=True  # 👈 importante: activar cambio obligatorio
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

    usuario = Usuario.query.filter(
        (Usuario.email == email_or_rut) | (Usuario.rut == email_or_rut)
    ).first()

    if not usuario or not bcrypt.checkpw(password.encode('utf-8'), usuario.password_hash.encode('utf-8')):
        return jsonify({'error': 'Credenciales inválidas'}), 401

    token = jwt.encode({
        'id_usuario': usuario.id_usuario,
        'id_empleado': usuario.id_empleado,
        'rol': usuario.rol,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }, SECRET_KEY, algorithm="HS256")

    return jsonify({
        'mensaje': 'Inicio de sesión exitoso',
        'rol': usuario.rol,
        'id_usuario': usuario.id_usuario,
        'id_empleado': usuario.id_empleado,
        'requiere_cambio_clave': usuario.requiere_cambio_clave,  # 👈 lo usará el frontend para redirigir
        'token': token
    })
