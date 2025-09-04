from fastapi import APIRouter, Depends

from internal.interfaces.controller.categoryController import CategoryController

# Rutas para categorías
router = APIRouter(prefix="/category", tags=["category"])

# Obtener todas las categorías
# Modificar mas adelante para obtener categorías por ID de una persona
@router.get("/")
def get_all_categories(controller: CategoryController = Depends(CategoryController)):
    return controller.get_all_categories()