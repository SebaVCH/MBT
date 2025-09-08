from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from internal.infrastructure.database.db import get_db
from internal.repository.paymentMethodRepository import PaymentMethodRepository
from internal.usecase.paymentMethodUseCase import PaymentMethodUseCase


class PaymentMethodController():
    def __init__(self, db: Session = Depends(get_db)):
        repository = PaymentMethodRepository(db)
        self.useCase = PaymentMethodUseCase(repository)

    def get_all_payment_methods(self):
        paymentMethods = self.useCase.get_all_payment_methods()
        if not paymentMethods:
            raise HTTPException(status_code=404, detail="Métodos de pago no encontrados")
        return paymentMethods

    def create_payment_method(self, payment_method_data):
        paymentMethod = self.useCase.create_payment_method(payment_method_data)
        if not paymentMethod:
            raise HTTPException(status_code=400, detail="Error al crear el método de pago")
        return paymentMethod

    def remove_payment_method(self, payment_method_id):
        result = self.useCase.remove_payment_method(payment_method_id)
        if not result:
            raise HTTPException(status_code=404, detail="Método de pago no encontrado")
        return {"detail": "Método de pago eliminado exitosamente"}



