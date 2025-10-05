from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session
from internal.domain.category import Category
from internal.infrastructure.database.db import get_db
from internal.schemas.categorySchema import CategoryResponse, CategoryCreate
from internal.api.middleware.auth import get_current_user
from internal.domain.person import Person

router = APIRouter(prefix="/category", tags=["category"])

@router.get("/", response_model=list[CategoryResponse])
def get_all_categories(db: Session = Depends(get_db), current_user: Person = Depends(get_current_user)):
    categories = db.query(Category).filter(or_(Category.personID == current_user.id, Category.personID == 0), Category.name != "Ingreso").all()
    return categories

@router.post("/", response_model=CategoryResponse)
def create_category(category_data: CategoryCreate, db: Session = Depends(get_db), current_user: Person = Depends(get_current_user)):
    new_category = Category(name=category_data.name, personID=current_user.id)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

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