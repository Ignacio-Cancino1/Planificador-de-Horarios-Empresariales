# backend/app.py

import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv  # 👈 Agregado para cargar .env local
from config import Config
from models.models import db
from routes.usuarios import usuarios_bp
from routes.empleados import empleados_bp
from routes.turnos import turnos_bp
from routes.asignaciones import asignaciones_bp
from routes.disponibilidad import disponibilidad_bp
from routes.notificaciones import notificaciones_bp
from routes.reportes import reportes_bp

# 👇 Cargar .env
load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

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
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host="0.0.0.0", port=port)
