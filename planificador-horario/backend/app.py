from flask import Flask
from flask_cors import CORS
from config import Config
from models.models import db
from routes.usuarios import usuarios_bp
from routes.empleados import empleados_bp
from routes.turnos import turnos_bp
from routes.asignaciones import asignaciones_bp

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
CORS(app)  # Habilita CORS para conexión con React

with app.app_context():
    db.create_all()

# Rutas
app.register_blueprint(usuarios_bp)
app.register_blueprint(empleados_bp)
app.register_blueprint(turnos_bp)
app.register_blueprint(asignaciones_bp)

@app.route("/")
def index():
    return "API Turnos funcionando"

if __name__ == "__main__":
    app.run(debug=True)
