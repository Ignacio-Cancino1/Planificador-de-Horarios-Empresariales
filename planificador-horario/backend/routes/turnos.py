from flask import Blueprint, request, jsonify
from models.models import db, Turno
from middlewares.auth import token_required, admin_required, empleados_o_admin_required

turnos_bp = Blueprint('turnos', __name__)

# ✅ Obtener todos los turnos (admin y empleado)
@turnos_bp.route('/api/turnos', methods=['GET', 'OPTIONS'])
@empleados_o_admin_required
def get_turnos():
    turnos = Turno.query.all()
    resultado = []
    for t in turnos:
        resultado.append({
            'id': t.id_turno,
            'fecha': t.fecha.strftime('%Y-%m-%d'),
            'hora_inicio': t.hora_inicio.strftime('%H:%M'),
            'hora_fin': t.hora_fin.strftime('%H:%M'),
            'descripcion': t.descripcion
        })
    return jsonify(resultado)

# ✅ Obtener un turno por ID (solo admin)
@turnos_bp.route('/api/turnos/<int:id>', methods=['GET', 'OPTIONS'])
@admin_required
def get_turno(id):
    turno = Turno.query.get_or_404(id)
    return jsonify({
        'id': turno.id_turno,
        'fecha': turno.fecha.strftime('%Y-%m-%d'),
        'hora_inicio': turno.hora_inicio.strftime('%H:%M'),
        'hora_fin': turno.hora_fin.strftime('%H:%M'),
        'descripcion': turno.descripcion
    })

# ✅ Crear un nuevo turno (solo admin)
@turnos_bp.route('/api/turnos', methods=['POST', 'OPTIONS'])
@admin_required
def crear_turno():
    data = request.get_json()
    nuevo_turno = Turno(
        fecha=data['fecha'],
        hora_inicio=data['hora_inicio'],
        hora_fin=data['hora_fin'],
        descripcion=data['descripcion']
    )
    db.session.add(nuevo_turno)
    db.session.commit()
    return jsonify({'mensaje': 'Turno creado correctamente'}), 201

# ✅ Actualizar turno (solo admin)
@turnos_bp.route('/api/turnos/<int:id>', methods=['PUT', 'OPTIONS'])
@admin_required
def actualizar_turno(id):
    data = request.get_json()
    turno = Turno.query.get_or_404(id)
    turno.fecha = data.get('fecha', turno.fecha)
    turno.hora_inicio = data.get('hora_inicio', turno.hora_inicio)
    turno.hora_fin = data.get('hora_fin', turno.hora_fin)
    turno.descripcion = data.get('descripcion', turno.descripcion)
    db.session.commit()
    return jsonify({'mensaje': 'Turno actualizado correctamente'})

# ✅ Eliminar turno (solo admin)
@turnos_bp.route('/api/turnos/<int:id>', methods=['DELETE', 'OPTIONS'])
@admin_required
def eliminar_turno(id):
    turno = Turno.query.get_or_404(id)
    db.session.delete(turno)
    db.session.commit()
    return jsonify({'mensaje': 'Turno eliminado correctamente'})
