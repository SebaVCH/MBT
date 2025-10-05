from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session
from internal.domain.paymentMethod import PaymentMethod
from internal.infrastructure.database.db import get_db
from internal.schemas.paymentMethodSchema import PaymentMethodResponse, PaymentMethodCreate
from internal.api.middleware.auth import get_current_user
from internal.domain.person import Person

router = APIRouter(prefix="/payment-method", tags=["payment-method"])

@router.get("/", response_model=list[PaymentMethodResponse])
def get_all_payment_methods(db: Session = Depends(get_db), current_user: Person = Depends(get_current_user)):
    return db.query(PaymentMethod).filter(or_(PaymentMethod.personID == current_user.id, PaymentMethod.personID == 0)).all()

@router.post("/", response_model=PaymentMethodResponse)
def create_payment_method(payment_method_data: PaymentMethodCreate, db: Session = Depends(get_db), current_user: Person = Depends(get_current_user)):
    new_payment_method = PaymentMethod(name=payment_method_data.name, personID=current_user.id)
    db.add(new_payment_method)
    db.commit()
    db.refresh(new_payment_method)
    return new_payment_method


@router.delete("/{payment_method_id}")
def remove_payment_method(
    payment_method_id: int,
    db: Session = Depends(get_db),
    current_user: Person = Depends(get_current_user)
):
    payment_method = db.query(PaymentMethod).filter(
        PaymentMethod.id == payment_method_id,
        PaymentMethod.personID == current_user.id
    ).first()

    if not payment_method:
        raise HTTPException(status_code=404, detail="Método de pago no encontrado o no pertenece al usuario")

    other_method = db.query(PaymentMethod).filter(
        PaymentMethod.name == "Otros",
        (PaymentMethod.personID == current_user.id) | (PaymentMethod.personID == 0)
    ).first()

    if not other_method:
        other_method = PaymentMethod(name="Otros", personID=current_user.id)
        db.add(other_method)
        db.commit()
        db.refresh(other_method)

    db.query(Transaction).filter(Transaction.paymentMethodID == payment_method.id).update(
        {Transaction.paymentMethodID: other_method.id}
    )

    db.delete(payment_method)
    db.commit()

    return {"detail": f"Método de pago eliminado y transacciones reasignadas a '{other_method.name}'"}
