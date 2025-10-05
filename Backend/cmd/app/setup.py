from internal.api.middleware.CORS import setupCORS
from internal.infrastructure.database.db import StartDB, SessionLocal
from fastapi import FastAPI

from internal.api.routes.routes import api_router
from internal.utils.initDefaults import init_default_data
from internal.utils.loadEnv import SetupEnv


def StartBackend() -> FastAPI:
    StartDB()

    db = SessionLocal()
    try:
        init_default_data(db)
    finally:
        db.close()

    app = FastAPI()

    setupCORS(app)
    app.include_router(api_router)

    SetupEnv()

    return app