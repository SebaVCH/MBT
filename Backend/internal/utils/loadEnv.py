import os

from dotenv import load_dotenv

# Variables de entorno
AIModel = os.getenv("AI_MODEL") # Modelo de IA a utilizar mas tarde
JWTSecret = os.getenv("JWT_SECRET") # Clave de JWT por definir

# Cargar variables de entorno desde el archivo .env
def SetupEnv():
    load_dotenv()

