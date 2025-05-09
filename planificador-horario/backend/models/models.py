# backend/models/models.py

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Empleado(db.Model):
    __tablename__ = 'empleados'
    ID_Empleado = db.Column(db.Integer, primary_key=True)
    Nombre = db.Column(db.String(50))
    Apellido = db.Column(db.String(50))
    Email = db.Column(db.String(100))
    Telefono = db.Column(db.String(20))
    Rol = db.Column(db.String(30))
    usuario = db.relationship("Usuario", uselist=False, backref="empleado")

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    ID_Usuario = db.Column(db.Integer, primary_key=True)
    Email = db.Column(db.String(100), unique=True, nullable=False)
    Rut = db.Column(db.String(20), unique=True)
    Password_Hash = db.Column(db.Text, nullable=False)
    Rol = db.Column(db.String(20), nullable=False)
    ID_Empleado = db.Column(db.Integer, db.ForeignKey('empleados.ID_Empleado'), unique=True)
