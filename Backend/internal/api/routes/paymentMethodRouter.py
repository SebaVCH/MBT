from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from internal.domain.paymentMethod import PaymentMethod
from internal.infrastructure.database.db import get_db
from internal.schemas.paymentMethodSchema import PaymentMethodResponse, PaymentMethodCreate

router = APIRouter(prefix="/payment-method", tags=["payment-method"])

# Obtener todos los métodos de pago
@router.get("/", response_model=list[PaymentMethodResponse])
def get_all_payment_methods(db: Session = Depends(get_db)):
    payment_methods = db.query(PaymentMethod).options(
        joinedload(PaymentMethod.person),
        joinedload(PaymentMethod.transactions)
    ).all()
    if not payment_methods:
        raise HTTPException(status_code=404, detail="Métodos de pago no encontrados")
    return payment_methods


# Crear un nuevo método de pago
@router.post("/", response_model=PaymentMethodResponse)
def create_payment_method(payment_method_data: PaymentMethodCreate, db: Session = Depends(get_db)):
    try:
        new_payment_method = PaymentMethod(**payment_method_data.model_dump())
        db.add(new_payment_method)
        db.commit()
        db.refresh(new_payment_method)
        return new_payment_method
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error al crear el método de pago")


# Eliminar un método de pago por ID
@router.delete("/{payment_method_id}")
def remove_payment_method(payment_method_id: int, db: Session = Depends(get_db)):
    payment_method = db.query(PaymentMethod).filter(PaymentMethod.id == payment_method_id).first()
    if not payment_method:
        raise HTTPException(status_code=404, detail="Método de pago no encontrado")

    try:
        db.delete(payment_method)
        db.commit()
        return {"detail": "Método de pago eliminado exitosamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error al eliminar el método de pago")

