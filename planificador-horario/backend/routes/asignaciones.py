from flask import Blueprint, request, jsonify
from models.models import db, Asignacion, Empleado, Turno
from middlewares.auth import token_required, admin_required

asignaciones_bp = Blueprint('asignaciones', __name__)

# Obtener todas las asignaciones
@asignaciones_bp.route('/api/asignaciones', methods=['GET', 'OPTIONS'])  # ✅
@admin_required
def get_asignaciones():
    asignaciones = Asignacion.query.all()
    resultado = []
    for a in asignaciones:
        resultado.append({
            'id': a.id_asignacion,
            'id_empleado': a.id_empleado,
            'id_turno': a.id_turno,
            'fecha_asignacion': a.fecha_asignacion.strftime('%Y-%m-%d %H:%M:%S')
        })
    return jsonify(resultado)

# Obtener una asignación por ID
@asignaciones_bp.route('/api/asignaciones/<int:id>', methods=['GET', 'OPTIONS'])  # ✅
@admin_required
def get_asignacion(id):
    a = Asignacion.query.get_or_404(id)
    return jsonify({
        'id': a.id_asignacion,
        'id_empleado': a.id_empleado,
        'id_turno': a.id_turno,
        'fecha_asignacion': a.fecha_asignacion.strftime('%Y-%m-%d %H:%M:%S')
    })

# Crear una nueva asignación
@asignaciones_bp.route('/api/asignaciones', methods=['POST', 'OPTIONS'])  # ✅
@admin_required
def crear_asignacion():
    data = request.get_json()
    id_empleado = data['id_empleado']
    id_turno = data['id_turno']

    if not db.session.get(Empleado, id_empleado):
        return jsonify({'error': 'Empleado no encontrado'}), 404

    if not db.session.get(Turno, id_turno):
        return jsonify({'error': 'Turno no encontrado'}), 404

    nueva_asignacion = Asignacion(
        id_empleado=id_empleado,
        id_turno=id_turno,
        fecha_asignacion=data['fecha_asignacion']
    )
    db.session.add(nueva_asignacion)
    db.session.commit()
    return jsonify({'mensaje': 'Asignación creada correctamente'}), 201

# Actualizar una asignación
@asignaciones_bp.route('/api/asignaciones/<int:id>', methods=['PUT', 'OPTIONS'])  # ✅
@admin_required
def actualizar_asignacion(id):
    data = request.get_json()
    asignacion = Asignacion.query.get_or_404(id)
    asignacion.id_empleado = data.get('id_empleado', asignacion.id_empleado)
    asignacion.id_turno = data.get('id_turno', asignacion.id_turno)
    asignacion.fecha_asignacion = data.get('fecha_asignacion', asignacion.fecha_asignacion)
    db.session.commit()
    return jsonify({'mensaje': 'Asignación actualizada correctamente'})

# Eliminar una asignación
@asignaciones_bp.route('/api/asignaciones/<int:id>', methods=['DELETE', 'OPTIONS'])  # ✅
@admin_required
def eliminar_asignacion(id):
    asignacion = Asignacion.query.get_or_404(id)
    db.session.delete(asignacion)
    db.session.commit()
    return jsonify({'mensaje': 'Asignación eliminada correctamente'})
