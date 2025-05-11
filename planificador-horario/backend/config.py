# backend/config.py

import os

class Config:
    # Toma la URI de la base de datos desde la variable de entorno si existe, o usa la local por defecto
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "postgresql://postgres:Nachox.17@localhost/gestion_turnos"
    )
    
    # Clave secreta para JWT, cargada desde entorno o fallback local
    SECRET_KEY = os.environ.get("SECRET_KEY", "clave-secreta-supersegura")

    SQLALCHEMY_TRACK_MODIFICATIONS = False
