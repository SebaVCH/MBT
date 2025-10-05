from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

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

@router.get("/balance")
def get_user_balance(db: Session = Depends(get_db), user: Person = Depends(get_current_user)):
    transactions = db.query(Transaction).filter(Transaction.personID == user.id).all()
    if not transactions:
        return {"balance": 0}

    total = 0
    for t in transactions:
        if t.category and t.category.name.lower() == "ingreso":
            total += t.amount
        else:
            total -= t.amount
    return {"balance": total}

@router.get("/income")
def get_user_income(db: Session = Depends(get_db), user: Person = Depends(get_current_user)):
    total_income = (
        db.query(func.sum(Transaction.amount))
        .join(Category)
        .filter(Transaction.personID == user.id, Category.name.ilike("ingreso"))
        .scalar()
    )
    return {"total_income": total_income or 0}

@router.get("/expenses")
def get_user_expenses(db: Session = Depends(get_db), user: Person = Depends(get_current_user)):
    total_expenses = (
        db.query(func.sum(Transaction.amount))
        .join(Category)
        .filter(Transaction.personID == user.id, Category.name.ilike("ingreso") == False)
        .scalar()
    )
    return {"total_expenses": total_expenses or 0}

@router.get("/transactions", response_model=list[TransactionResponse])
def get_user_transactions(db: Session = Depends(get_db), user: Person = Depends(get_current_user)):
    transactions = db.query(Transaction).filter(Transaction.personID == user.id).all()
    return transactions