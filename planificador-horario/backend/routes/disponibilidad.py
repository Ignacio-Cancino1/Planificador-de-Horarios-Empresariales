# backend/routes/disponibilidad.py

from flask import Blueprint, request, jsonify
from models.models import db, Disponibilidad, Empleado
from middlewares.auth import token_required

disponibilidad_bp = Blueprint('disponibilidad', __name__)

# Obtener todas las disponibilidades
@disponibilidad_bp.route('/api/disponibilidad', methods=['GET'])
@token_required
def get_disponibilidades():
    disponibilidades = Disponibilidad.query.all()
    resultado = []
    for d in disponibilidades:
        resultado.append({
            'id': d.id_disponibilidad,
            'id_empleado': d.id_empleado,
            'dia_semana': d.dia_semana,
            'hora_inicio': d.hora_inicio.strftime('%H:%M'),
            'hora_fin': d.hora_fin.strftime('%H:%M')
        })
    return jsonify(resultado)

# Obtener disponibilidad por ID
@disponibilidad_bp.route('/api/disponibilidad/<int:id>', methods=['GET'])
@token_required
def get_disponibilidad(id):
    d = Disponibilidad.query.get_or_404(id)
    return jsonify({
        'id': d.id_disponibilidad,
        'id_empleado': d.id_empleado,
        'dia_semana': d.dia_semana,
        'hora_inicio': d.hora_inicio.strftime('%H:%M'),
        'hora_fin': d.hora_fin.strftime('%H:%M')
    })

# Crear disponibilidad
@disponibilidad_bp.route('/api/disponibilidad', methods=['POST'])
@token_required
def crear_disponibilidad():
    data = request.get_json()
    id_empleado = data['id_empleado']

    if not db.session.get(Empleado, id_empleado):
        return jsonify({'error': 'Empleado no encontrado'}), 404

    nueva_disp = Disponibilidad(
        id_empleado=id_empleado,
        dia_semana=data['dia_semana'],
        hora_inicio=data['hora_inicio'],
        hora_fin=data['hora_fin']
    )
    db.session.add(nueva_disp)
    db.session.commit()
    return jsonify({'mensaje': 'Disponibilidad registrada correctamente'}), 201

# Actualizar disponibilidad
@disponibilidad_bp.route('/api/disponibilidad/<int:id>', methods=['PUT'])
@token_required
def actualizar_disponibilidad(id):
    d = Disponibilidad.query.get_or_404(id)
    data = request.get_json()
    d.dia_semana = data.get('dia_semana', d.dia_semana)
    d.hora_inicio = data.get('hora_inicio', d.hora_inicio)
    d.hora_fin = data.get('hora_fin', d.hora_fin)
    db.session.commit()
    return jsonify({'mensaje': 'Disponibilidad actualizada correctamente'})

# Eliminar disponibilidad
@disponibilidad_bp.route('/api/disponibilidad/<int:id>', methods=['DELETE'])
@token_required
def eliminar_disponibilidad(id):
    d = Disponibilidad.query.get_or_404(id)
    db.session.delete(d)
    db.session.commit()
    return jsonify({'mensaje': 'Disponibilidad eliminada correctamente'})
