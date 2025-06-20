# backend/models/models.py

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Empleado(db.Model):
    __tablename__ = 'empleados'

    id_empleado = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50))
    apellido = db.Column(db.String(50))
    email = db.Column(db.String(100))
    telefono = db.Column(db.String(20))
    rol = db.Column(db.String(30))

    usuario = db.relationship("Usuario", backref="empleado", uselist=False)


class Usuario(db.Model):
    __tablename__ = 'usuarios'

    id_usuario = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    rut = db.Column(db.String(20), unique=True)
    password_hash = db.Column(db.Text, nullable=False)
    rol = db.Column(db.String(20), nullable=False)
    id_empleado = db.Column(db.Integer, db.ForeignKey('empleados.id_empleado'), unique=True)

    # ✅ CAMPO NECESARIO PARA CAMBIO DE CLAVE EN PRIMER LOGIN
    requiere_cambio_clave = db.Column(db.Boolean, default=True)  # <--- este es el cambio


class Turno(db.Model):
    __tablename__ = 'turno'

    id_turno = db.Column(db.Integer, primary_key=True)
    fecha = db.Column(db.Date, nullable=False)
    hora_inicio = db.Column(db.Time, nullable=False)
    hora_fin = db.Column(db.Time, nullable=False)
    descripcion = db.Column(db.Text)


class Asignacion(db.Model):
    __tablename__ = 'asignacion'

    id_asignacion = db.Column(db.Integer, primary_key=True)
    id_empleado = db.Column(db.Integer, db.ForeignKey('empleados.id_empleado'))
    id_turno = db.Column(db.Integer, db.ForeignKey('turno.id_turno'))
    fecha_asignacion = db.Column(db.DateTime)


class Disponibilidad(db.Model):
    __tablename__ = 'disponibilidad'

    id_disponibilidad = db.Column(db.Integer, primary_key=True)
    id_empleado = db.Column(db.Integer, db.ForeignKey('empleados.id_empleado'))
    dia_semana = db.Column(db.String(15))
    hora_inicio = db.Column(db.Time)
    hora_fin = db.Column(db.Time)


class Notificacion(db.Model):
    __tablename__ = 'notificacion'

    id_notificacion = db.Column(db.Integer, primary_key=True)
    id_empleado = db.Column(db.Integer, db.ForeignKey('empleados.id_empleado'))
    mensaje = db.Column(db.Text)
    fecha_envio = db.Column(db.DateTime)


class Reporte(db.Model):
    __tablename__ = 'reporte'

    id_reporte = db.Column(db.Integer, primary_key=True)
    id_empleado = db.Column(db.Integer, db.ForeignKey('empleados.id_empleado'))
    tipo_reporte = db.Column(db.Text)
    fecha_generacion = db.Column(db.DateTime)
    contenido = db.Column(db.Text)
