from internal.api.middleware.CORS import setupCORS
from internal.infrastructure.database.db import StartDB
from fastapi import FastAPI

from internal.api.routes.routes import api_router
from internal.utils.loadEnv import SetupEnv


def StartBackend() -> FastAPI:
    StartDB()
    app = FastAPI()
    setupCORS(app)
    app.include_router(api_router)

    SetupEnv()

    return app