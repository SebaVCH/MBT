from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from internal.domain.paymentMethod import PaymentMethod
from internal.infrastructure.database.db import get_db
from internal.schemas.paymentMethodSchema import PaymentMethodResponse, PaymentMethodCreate
from internal.api.middleware.auth import get_current_user
from internal.domain.person import Person

router = APIRouter(prefix="/payment-method", tags=["payment-method"])

@router.get("/", response_model=list[PaymentMethodResponse])
def get_all_payment_methods(db: Session = Depends(get_db), current_user: Person = Depends(get_current_user)):
    return db.query(PaymentMethod).filter(PaymentMethod.personID == current_user.id).all()

@router.post("/", response_model=PaymentMethodResponse)
def create_payment_method(payment_method_data: PaymentMethodCreate, db: Session = Depends(get_db), current_user: Person = Depends(get_current_user)):
    new_payment_method = PaymentMethod(name=payment_method_data.name, personID=current_user.id)
    db.add(new_payment_method)
    db.commit()
    db.refresh(new_payment_method)
    return new_payment_method


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

