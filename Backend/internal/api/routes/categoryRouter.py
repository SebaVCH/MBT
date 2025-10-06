from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session
from internal.domain.category import Category
from internal.domain.transaction import Transaction
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
def remove_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: Person = Depends(get_current_user)
):
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.personID == current_user.id
    ).first()

    if not category:
        raise HTTPException(status_code=404, detail="Categoría no encontrada o no pertenece al usuario")

    other_category = db.query(Category).filter(
        Category.name == "Otros",
        (Category.personID == current_user.id) | (Category.personID == 0)
    ).first()

    if not other_category:
        other_category = Category(name="Otros", personID=current_user.id)
        db.add(other_category)
        db.commit()
        db.refresh(other_category)

    db.query(Transaction).filter(Transaction.categoryID == category.id).update(
        {Transaction.categoryID: other_category.id}
    )

    db.delete(category)
    db.commit()

    return {"detail": f"Categoría eliminada y transacciones reasignadas a '{other_category.name}'"}
