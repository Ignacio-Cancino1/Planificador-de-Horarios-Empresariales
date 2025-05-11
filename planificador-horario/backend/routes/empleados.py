from flask import Blueprint, request, jsonify
from models.models import db, Empleado, Usuario
from middlewares.auth import token_required, admin_required, empleados_o_admin_required
import bcrypt

empleados_bp = Blueprint('empleados', __name__)

# ✅ Ruta accesible tanto por admin como empleados
@empleados_bp.route('/api/empleados', methods=['GET', 'OPTIONS'])
@empleados_o_admin_required
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

# ✅ Obtener un empleado por ID - solo si eres admin o tú mismo
@empleados_bp.route('/api/empleados/<int:id>', methods=['GET', 'OPTIONS'])
@empleados_o_admin_required
def get_empleado(id):
    usuario = request.usuario

    # 🔒 Si es empleado, solo puede ver su propio perfil
    if usuario['rol'] == 'empleado' and usuario['id_empleado'] != id:
        return jsonify({'error': 'Acceso no autorizado'}), 403

    empleado = Empleado.query.get_or_404(id)
    return jsonify({
        'id_empleado': empleado.id_empleado,
        'nombre': empleado.nombre,
        'apellido': empleado.apellido,
        'email': empleado.email,
        'telefono': empleado.telefono,
        'rol': empleado.rol
    })

# ✅ Crear nuevo empleado y usuario
@empleados_bp.route('/api/empleados', methods=['POST', 'OPTIONS'])
@admin_required
def crear_empleado():
    data = request.get_json()
    try:
        print("📥 Datos recibidos:", data)

        nuevo_empleado = Empleado(
            nombre=data['nombre'],
            apellido=data['apellido'],
            email=data['email'],
            telefono=data['telefono'],
            rol=data['rol']
        )
        db.session.add(nuevo_empleado)
        db.session.flush()

        contraseña_temporal = "cambiar123"
        hash = bcrypt.hashpw(contraseña_temporal.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

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

# ✅ Actualizar empleado
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

# ✅ Eliminar empleado
@empleados_bp.route('/api/empleados/<int:id>', methods=['DELETE', 'OPTIONS'])
@admin_required
def eliminar_empleado(id):
    empleado = Empleado.query.get_or_404(id)
    db.session.delete(empleado)
    db.session.commit()
    return jsonify({'mensaje': 'Empleado eliminado correctamente'})
