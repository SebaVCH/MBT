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