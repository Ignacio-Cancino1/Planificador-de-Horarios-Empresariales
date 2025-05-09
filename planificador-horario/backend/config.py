# backend/config.py

import os

class Config:
    SQLALCHEMY_DATABASE_URI = "postgresql://postgres:Nachox.17@localhost/gestion_turnos"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
