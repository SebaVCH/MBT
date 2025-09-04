from internal.infrastructure.database.database import StartDB
from fastapi import FastAPI

from internal.interfaces.routes.routes import api_router
from internal.utils.loadEnv import SetupEnv


# Funcion para FastAPI, inicializa la base de datos, cargar variables de entorno y agregar las rutas
def StartBackend() -> FastAPI:
    StartDB()
    app = FastAPI()
    app.include_router(api_router)
    SetupEnv()

    return app