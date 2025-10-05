from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from internal.infrastructure.database.db import get_db
from internal.domain.person import Person
from internal.api.middleware.auth import get_current_user  # ✅ importar solo esto

router = APIRouter(prefix="/person", tags=["Person"])

@router.post("/deposit")
def deposit(amount: int, user: Person = Depends(get_current_user), db: Session = Depends(get_db)):
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Monto inválido")
    user.balance += amount
    db.commit()
    return {"message": "Monto ingresado", "balance": user.balance}

@router.post("/withdraw")
def withdraw(amount: int, user: Person = Depends(get_current_user), db: Session = Depends(get_db)):
    if amount <= 0 or amount > user.balance:
        raise HTTPException(status_code=400, detail="Monto inválido o saldo insuficiente")
    user.balance -= amount
    db.commit()
    return {"message": "Monto retirado", "balance": user.balance}
