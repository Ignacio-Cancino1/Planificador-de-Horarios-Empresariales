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

# ✅ Configuración CORS corregida y compatible con autenticación vía token
CORS(app, supports_credentials=True, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:3000",
            "https://planificador-de-horarios-empresariales.vercel.app"
        ]
    }
})

with app.app_context():
    db.create_all()

# Registrar Blueprints
app.register_blueprint(usuarios_bp)
app.register_blueprint(empleados_bp)
app.register_blueprint(turnos_bp)
app.register_blueprint(asignaciones_bp)
app.register_blueprint(disponibilidad_bp)
app.register_blueprint(notificaciones_bp)
app.register_blueprint(reportes_bp)

@app.route("/")
def index():
    return "API Turnos funcionando"

if __name__ == "__main__":
    app.run(debug=True)
