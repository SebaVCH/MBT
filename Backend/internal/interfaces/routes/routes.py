from fastapi import APIRouter

from internal.interfaces.routes import categoryRouter, paymentMethodRouter

# Definición del router principal que incluye las rutas de categorías y otras futuras rutas
api_router = APIRouter()
api_router.include_router(categoryRouter.router)
api_router.include_router(paymentMethodRouter.router)