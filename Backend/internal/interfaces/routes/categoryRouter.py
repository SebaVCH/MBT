from fastapi import APIRouter, Depends

from internal.interfaces.controller.categoryController import CategoryController

# Rutas para categorías
router = APIRouter(prefix="/category", tags=["category"])

# Obtener todas las categorías
# Modificar mas adelante para obtener categorías por ID de una persona
@router.get("/")
def get_all_categories(controller: CategoryController = Depends(CategoryController)):
    return controller.get_all_categories()

# Crear una nueva categoría
# Modificar mas adelante para crear categorías asociadas a una persona
@router.post("/")
def create_category(category_data: dict, controller: CategoryController = Depends(CategoryController)):
    return controller.create_category(category_data)

# Eliminar una categoría por ID
# Modificar mas adelante para eliminar categorías asociadas a una persona
@router.delete("/{category_id}")
def remove_category(category_id: int, controller: CategoryController = Depends(CategoryController)):
    return controller.remove_category(category_id)