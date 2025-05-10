# backend/routes/notificaciones.py

from flask import Blueprint, request, jsonify
from models.models import db, Notificacion, Empleado
from middlewares.auth import token_required

notificaciones_bp = Blueprint('notificaciones', __name__)

# Obtener todas las notificaciones
@notificaciones_bp.route('/api/notificaciones', methods=['GET'])
@token_required
def get_notificaciones():
    notificaciones = Notificacion.query.all()
    resultado = []
    for n in notificaciones:
        resultado.append({
            'id': n.id_notificacion,
            'id_empleado': n.id_empleado,
            'mensaje': n.mensaje,
            'fecha_envio': n.fecha_envio.strftime('%Y-%m-%d %H:%M:%S')
        })
    return jsonify(resultado)

# Obtener una notificación por ID
@notificaciones_bp.route('/api/notificaciones/<int:id>', methods=['GET'])
@token_required
def get_notificacion(id):
    n = Notificacion.query.get_or_404(id)
    return jsonify({
        'id': n.id_notificacion,
        'id_empleado': n.id_empleado,
        'mensaje': n.mensaje,
        'fecha_envio': n.fecha_envio.strftime('%Y-%m-%d %H:%M:%S')
    })

# Crear una nueva notificación
@notificaciones_bp.route('/api/notificaciones', methods=['POST'])
@token_required
def crear_notificacion():
    data = request.get_json()
    id_empleado = data['id_empleado']

    if not db.session.get(Empleado, id_empleado):
        return jsonify({'error': 'Empleado no encontrado'}), 404

    nueva_notificacion = Notificacion(
        id_empleado=id_empleado,
        mensaje=data['mensaje'],
        fecha_envio=data['fecha_envio']
    )
    db.session.add(nueva_notificacion)
    db.session.commit()
    return jsonify({'mensaje': 'Notificación creada correctamente'}), 201

# Actualizar una notificación
@notificaciones_bp.route('/api/notificaciones/<int:id>', methods=['PUT'])
@token_required
def actualizar_notificacion(id):
    n = Notificacion.query.get_or_404(id)
    data = request.get_json()
    n.mensaje = data.get('mensaje', n.mensaje)
    n.fecha_envio = data.get('fecha_envio', n.fecha_envio)
    db.session.commit()
    return jsonify({'mensaje': 'Notificación actualizada correctamente'})

# Eliminar una notificación
@notificaciones_bp.route('/api/notificaciones/<int:id>', methods=['DELETE'])
@token_required
def eliminar_notificacion(id):
    n = Notificacion.query.get_or_404(id)
    db.session.delete(n)
    db.session.commit()
    return jsonify({'mensaje': 'Notificación eliminada correctamente'})
