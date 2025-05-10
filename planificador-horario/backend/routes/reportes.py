# backend/routes/reportes.py

from flask import Blueprint, request, jsonify
from models.models import db, Reporte, Empleado
from middlewares.auth import token_required

reportes_bp = Blueprint('reportes', __name__)

# Obtener todos los reportes
@reportes_bp.route('/api/reportes', methods=['GET'])
@token_required
def get_reportes():
    reportes = Reporte.query.all()
    resultado = []
    for r in reportes:
        resultado.append({
            'id': r.id_reporte,
            'id_empleado': r.id_empleado,
            'tipo_reporte': r.tipo_reporte,
            'fecha_generacion': r.fecha_generacion.strftime('%Y-%m-%d %H:%M:%S'),
            'contenido': r.contenido
        })
    return jsonify(resultado)

# Obtener un reporte por ID
@reportes_bp.route('/api/reportes/<int:id>', methods=['GET'])
@token_required
def get_reporte(id):
    r = Reporte.query.get_or_404(id)
    return jsonify({
        'id': r.id_reporte,
        'id_empleado': r.id_empleado,
        'tipo_reporte': r.tipo_reporte,
        'fecha_generacion': r.fecha_generacion.strftime('%Y-%m-%d %H:%M:%S'),
        'contenido': r.contenido
    })

# Crear un nuevo reporte
@reportes_bp.route('/api/reportes', methods=['POST'])
@token_required
def crear_reporte():
    data = request.get_json()
    id_empleado = data['id_empleado']

    if not db.session.get(Empleado, id_empleado):
        return jsonify({'error': 'Empleado no encontrado'}), 404

    nuevo_reporte = Reporte(
        id_empleado=id_empleado,
        tipo_reporte=data['tipo_reporte'],
        fecha_generacion=data['fecha_generacion'],
        contenido=data['contenido']
    )
    db.session.add(nuevo_reporte)
    db.session.commit()
    return jsonify({'mensaje': 'Reporte generado correctamente'}), 201

# Actualizar un reporte
@reportes_bp.route('/api/reportes/<int:id>', methods=['PUT'])
@token_required
def actualizar_reporte(id):
    r = Reporte.query.get_or_404(id)
    data = request.get_json()
    r.tipo_reporte = data.get('tipo_reporte', r.tipo_reporte)
    r.fecha_generacion = data.get('fecha_generacion', r.fecha_generacion)
    r.contenido = data.get('contenido', r.contenido)
    db.session.commit()
    return jsonify({'mensaje': 'Reporte actualizado correctamente'})

# Eliminar un reporte
@reportes_bp.route('/api/reportes/<int:id>', methods=['DELETE'])
@token_required
def eliminar_reporte(id):
    r = Reporte.query.get_or_404(id)
    db.session.delete(r)
    db.session.commit()
    return jsonify({'mensaje': 'Reporte eliminado correctamente'})
