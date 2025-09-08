from internal.infrastructure.database.db import StartDB
from fastapi import FastAPI

from internal.interfaces.routes.routes import api_router
from internal.utils.loadEnv import SetupEnv

from internal.interfaces.routes.auth_routes import auth_router
from internal.interfaces.routes.person_routes import person_router


def StartBackend() -> FastAPI:
    StartDB()
    app = FastAPI()
    app.include_router(api_router)

    app.include_router(auth_router)
    app.include_router(person_router)

    SetupEnv()

    return app