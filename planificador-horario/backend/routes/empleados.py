from flask import Blueprint, request, jsonify
from models.models import db, Empleado
from middlewares.auth import token_required, admin_required

empleados_bp = Blueprint('empleados', __name__)

# Obtener todos los empleados
@empleados_bp.route('/api/empleados', methods=['GET', 'OPTIONS'])  # ✅
@admin_required
def get_empleados():
    empleados = Empleado.query.all()
    resultado = []
    for e in empleados:
        resultado.append({
            'id': e.id_empleado,
            'nombre': e.nombre,
            'apellido': e.apellido,
            'email': e.email,
            'telefono': e.telefono,
            'rol': e.rol
        })
    return jsonify(resultado)

# Obtener un solo empleado por ID
@empleados_bp.route('/api/empleados/<int:id>', methods=['GET', 'OPTIONS'])  # ✅
@admin_required
def get_empleado(id):
    empleado = Empleado.query.get_or_404(id)
    return jsonify({
        'id': empleado.id_empleado,
        'nombre': empleado.nombre,
        'apellido': empleado.apellido,
        'email': empleado.email,
        'telefono': empleado.telefono,
        'rol': empleado.rol
    })

# Crear un nuevo empleado
@empleados_bp.route('/api/empleados', methods=['POST', 'OPTIONS'])  # ✅
@admin_required
def crear_empleado():
    data = request.get_json()
    nuevo_empleado = Empleado(
        nombre=data['nombre'],
        apellido=data['apellido'],
        email=data['email'],
        telefono=data['telefono'],
        rol=data['rol']
    )
    db.session.add(nuevo_empleado)
    db.session.commit()
    return jsonify({'mensaje': 'Empleado creado correctamente'}), 201

# Actualizar un empleado existente
@empleados_bp.route('/api/empleados/<int:id>', methods=['PUT', 'OPTIONS'])  # ✅
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
@empleados_bp.route('/api/empleados/<int:id>', methods=['DELETE', 'OPTIONS'])  # ✅
@admin_required
def eliminar_empleado(id):
    empleado = Empleado.query.get_or_404(id)
    db.session.delete(empleado)
    db.session.commit()
    return jsonify({'mensaje': 'Empleado eliminado correctamente'})
