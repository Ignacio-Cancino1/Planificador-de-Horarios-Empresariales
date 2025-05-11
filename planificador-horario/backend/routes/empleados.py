from flask import Blueprint, request, jsonify
from models.models import db, Empleado, Usuario
from middlewares.auth import token_required, admin_required
from werkzeug.security import generate_password_hash

empleados_bp = Blueprint('empleados', __name__)

# Obtener todos los empleados
@empleados_bp.route('/api/empleados', methods=['GET', 'OPTIONS'])
@admin_required
def get_empleados():
    empleados = Empleado.query.all()
    resultado = []
    for e in empleados:
        resultado.append({
            'id_empleado': e.id_empleado,
            'nombre': e.nombre,
            'apellido': e.apellido,
            'email': e.email,
            'telefono': e.telefono,
            'rol': e.rol
        })
    return jsonify(resultado)

# Obtener un solo empleado
@empleados_bp.route('/api/empleados/<int:id>', methods=['GET', 'OPTIONS'])
@admin_required
def get_empleado(id):
    empleado = Empleado.query.get_or_404(id)
    return jsonify({
        'id_empleado': empleado.id_empleado,
        'nombre': empleado.nombre,
        'apellido': empleado.apellido,
        'email': empleado.email,
        'telefono': empleado.telefono,
        'rol': empleado.rol
    })

# Crear un nuevo empleado y usuario asociado
@empleados_bp.route('/api/empleados', methods=['POST', 'OPTIONS'])
@admin_required
def crear_empleado():
    data = request.get_json()
    
    try:
        print("📥 Datos recibidos:", data)  # Log útil

        # 1. Crear el empleado
        nuevo_empleado = Empleado(
            nombre=data['nombre'],
            apellido=data['apellido'],
            email=data['email'],
            telefono=data['telefono'],
            rol=data['rol']
        )
        db.session.add(nuevo_empleado)
        db.session.flush()  # Obtener id_empleado antes del commit

        # 2. Crear el usuario con clave temporal
        contraseña_temporal = "cambiar123"
        hash = generate_password_hash(contraseña_temporal)

        nuevo_usuario = Usuario(
            email=data['email'],
            password_hash=hash,
            rol=data['rol'],
            id_empleado=nuevo_empleado.id_empleado,
            requiere_cambio_clave=True
        )
        db.session.add(nuevo_usuario)
        db.session.commit()

        print("✅ Empleado y usuario creados correctamente")
        return jsonify({'mensaje': 'Empleado y usuario creados correctamente'}), 201

    except Exception as e:
        db.session.rollback()
        print("❌ Error al crear empleado:", str(e))
        return jsonify({'error': str(e)}), 500

# Actualizar un empleado
@empleados_bp.route('/api/empleados/<int:id>', methods=['PUT', 'OPTIONS'])
@admin_required
def actualizar_empleado(id):
    data = request.get_json()
    empleado = Empleado.query.get_or_404(id)
    empleado.nombre = data.get('nombre', empleado.nombre)
    empleado.apellido = data.get('apellido', empleado.apellido)
    empleado.email = data.get('email', empleado.email)
    empleado.telefono = data.get('telefono', empleado.telefono)
    empleado.rol = data.get('rol', empleado.rol)
    db.session.commit()
    return jsonify({'mensaje': 'Empleado actualizado correctamente'})

# Eliminar un empleado
@empleados_bp.route('/api/empleados/<int:id>', methods=['DELETE', 'OPTIONS'])
@admin_required
def eliminar_empleado(id):
    empleado = Empleado.query.get_or_404(id)
    db.session.delete(empleado)
    db.session.commit()
    return jsonify({'mensaje': 'Empleado eliminado correctamente'})
