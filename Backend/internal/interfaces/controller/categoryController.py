from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from internal.infrastructure.database.database import ReturnDB
from internal.repository.categoryRepository import CategoryRepository
from internal.usecase.categoryUseCase import CategoryUseCase

# Controlador de Categorías
class CategoryController:
    def __init__(self, db: Session = Depends(ReturnDB)):
        repository = CategoryRepository(db)
        self.useCase = CategoryUseCase(repository)

    def get_all_categories(self):
        categories = self.useCase.get_all_categories()
        if not categories:
            raise HTTPException(status_code=404, detail="Categorías no encontradas")
        return categories

    def create_category(self, category_data):
        category = self.useCase.create_category(category_data)
        if not category:
            raise HTTPException(status_code=400, detail="Error al crear la categoría")
        return category

    def remove_category(self, category_id):
        result = self.useCase.remove_category(category_id)
        if not result:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")
        return {"detail": "Categoría eliminada exitosamente"}