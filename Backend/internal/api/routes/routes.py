from fastapi import APIRouter

from internal.api.routes import categoryRouter, paymentMethodRouter, authRouter, personRouter

# Definición del router principal que incluye las rutas de categorías y otras futuras rutas
api_router = APIRouter()
api_router.include_router(categoryRouter.router)
api_router.include_router(paymentMethodRouter.router)
api_router.include_router(authRouter.router)
api_router.include_router(personRouter.router)