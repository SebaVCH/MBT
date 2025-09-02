from internal.infrastructure.database.database import StartDB
from fastapi import FastAPI

# Funcion para FastAPI, inicializa la base de datos y retorna la app
def StartBackend() -> FastAPI:
    app = FastAPI()
    StartDB()

    return app