from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from internal.infrastructure.database.db import get_db
from internal.domain.person import Person
from internal.schemas.auth_schema import UserRegister, UserLogin, TokenResponse
from internal.utils.security import hash_password, verify_password, create_access_token

auth_router = APIRouter(prefix="/auth", tags=["Auth"])

@auth_router.post("/register", response_model=TokenResponse)
def register(user: UserRegister, db: Session = Depends(get_db)):
    db_user = db.query(Person).filter(Person.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email ya registrado")

    new_user = Person(
        email=user.email,
        name=user.name,
        password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": str(new_user.id)})
    return {"access_token": token, "token_type": "bearer"}

@auth_router.post("/login", response_model=TokenResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(Person).filter(Person.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    token = create_access_token({"sub": str(db_user.id)})
    return {"access_token": token, "token_type": "bearer"}
