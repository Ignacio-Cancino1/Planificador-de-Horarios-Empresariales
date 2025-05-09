# backend/app.py

from flask import Flask
from config import Config
from models.models import db

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

# Crear las tablas si no existen
with app.app_context():
    db.create_all()

@app.route("/")
def index():
    return "API Turnos funcionando"

if __name__ == "__main__":
    app.run(debug=True)
