from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from internal.infrastructure.database.db import get_db
from internal.domain.person import Person
from internal.utils.security import decode_token
from fastapi.security import HTTPBearer
from fastapi.security import HTTPAuthorizationCredentials

oauth2_scheme = HTTPBearer()

person_router = APIRouter(prefix="/person", tags=["Person"])

def get_current_user(token: HTTPAuthorizationCredentials = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_token(token.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido")
    user = db.query(Person).filter(Person.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    return user

@person_router.post("/deposit")
def deposit(amount: int, user: Person = Depends(get_current_user), db: Session = Depends(get_db)):
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Monto inválido")
    user.balance += amount
    db.commit()
    return {"message": "Monto ingresado", "balance": user.balance}

@person_router.post("/withdraw")
def withdraw(amount: int, user: Person = Depends(get_current_user), db: Session = Depends(get_db)):
    if amount <= 0 or amount > user.balance:
        raise HTTPException(status_code=400, detail="Monto inválido o saldo insuficiente")
    user.balance -= amount
    db.commit()
    return {"message": "Monto retirado", "balance": user.balance}
