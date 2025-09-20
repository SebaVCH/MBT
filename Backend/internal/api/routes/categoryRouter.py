from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from internal.domain.category import Category
from internal.infrastructure.database.db import get_db
from internal.schemas.categorySchema import CategoryResponse, CategoryCreate

# Rutas para categorías
router = APIRouter(prefix="/category", tags=["category"])

# Obtener todas las categorías
@router.get("/", response_model=list[CategoryResponse])
def get_all_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).options(joinedload(Category.person)).all()
    if not categories:
        raise HTTPException(status_code=404, detail="Categorías no encontradas")
    return categories

# Crear una nueva categoría
@router.post("/", response_model=CategoryResponse)
def create_category(category_data: CategoryCreate, db: Session = Depends(get_db)):
    try:
        new_category = Category(**category_data.model_dump())
        db.add(new_category)
        db.commit()
        db.refresh(new_category)
        return new_category
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error al crear la categoría")

# Eliminar una categoría por ID
@router.delete("/{category_id}")
def remove_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    try:
        db.delete(category)
        db.commit()
        return {"detail": "Categoría eliminada exitosamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error al eliminar la categoría")