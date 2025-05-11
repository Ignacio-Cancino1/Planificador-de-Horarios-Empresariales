# backend/app.py

from flask import Flask
from flask_cors import CORS
from config import Config
from models.models import db
from routes.usuarios import usuarios_bp
from routes.empleados import empleados_bp
from routes.turnos import turnos_bp
from routes.asignaciones import asignaciones_bp
from routes.disponibilidad import disponibilidad_bp
from routes.notificaciones import notificaciones_bp
from routes.reportes import reportes_bp

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

# ✅ Habilita CORS para localhost y para tu frontend en Vercel
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:3000",           # desarrollo local
            "https://planificador-de-horarios-empresariales.vercel.app"        # producción en Vercel (reemplaza con tu dominio real)
        ]
    }
})

# Crear tablas si no existen
with app.app_context():
    db.create_all()

# Registrar Blueprints (rutas)
app.register_blueprint(usuarios_bp)
app.register_blueprint(empleados_bp)
app.register_blueprint(turnos_bp)
app.register_blueprint(asignaciones_bp)
app.register_blueprint(disponibilidad_bp)
app.register_blueprint(notificaciones_bp)
app.register_blueprint(reportes_bp)

# Ruta raíz simple para probar conexión
@app.route("/")
def index():
    return "API Turnos funcionando"

if __name__ == "__main__":
    app.run(debug=True)
