from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from internal.domain.category import Category
from internal.domain.transaction import Transaction
from internal.infrastructure.database.db import get_db
from internal.domain.person import Person
from internal.api.middleware.auth import get_current_user
from internal.schemas.transactionSchema import TransactionResponse, WithdrawRequest

router = APIRouter(prefix="/person", tags=["Person"])

@router.post("/deposit", response_model=TransactionResponse)
def deposit(amount: int, description: str | None = None ,user: Person = Depends(get_current_user), db: Session = Depends(get_db)):
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Monto inválido")

    ingreso_category = db.query(Category).filter(
        Category.name == "Ingreso",
        (Category.personID == user.id) | (Category.personID == 0)).first()

    if not ingreso_category:
        raise HTTPException(status_code=404, detail="Categoría 'Ingreso' no encontrada")

    transaction = Transaction(
        personID=user.id,
        categoryID=ingreso_category.id,
        paymentMethodID=None,
        date=datetime.now(),
        amount=amount,
        description=description
    )

    user.balance += amount
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction

@router.post("/withdraw",response_model=TransactionResponse)
def withdraw(request: WithdrawRequest ,user: Person = Depends(get_current_user), db: Session = Depends(get_db)):
    if request.amount <= 0 or request.amount > user.balance:
        raise HTTPException(status_code=400, detail="Monto inválido o saldo insuficiente")

    category = db.query(Category).filter(
        Category.id == request.categoryID,
        (Category.personID == user.id) | (Category.personID == 0)
    ).first()

    if not category:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    transaction = Transaction(
        personID=user.id,
        categoryID=request.categoryID,
        paymentMethodID=request.paymentMethodID,
        date=datetime.now(),
        amount=request.amount,
        description=request.description
    )

    user.balance -= request.amount
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction
