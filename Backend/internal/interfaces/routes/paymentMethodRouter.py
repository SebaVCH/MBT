from fastapi import APIRouter, Depends

from internal.interfaces.controller.paymentMethodController import PaymentMethodController

router = APIRouter(prefix="/payment-method", tags=["payment-method"])
# Rutas para métodos de pago
# Obtener todos los métodos de pago de un usuario
# Modificar mas adelante para obtener métodos de pago por ID de una persona
@router.get("/")
def get_all_payment_methods(controller: PaymentMethodController = Depends(PaymentMethodController)):
    return controller.get_all_payment_methods()

# Crear un nuevo método de pago para un usuario
# Modificar mas adelante para crear métodos de pago asociados a una persona
@router.post("/")
def create_payment_method(payment_method_data: dict, controller: PaymentMethodController = Depends(PaymentMethodController)):
    return controller.create_payment_method(payment_method_data)

# Eliminar un método de pago por ID
# Modificar mas adelante para eliminar métodos de pago asociados a una persona
@router.delete("/{payment_method_id}")
def remove_payment_method(payment_method_id: int, controller: PaymentMethodController = Depends(PaymentMethodController)):
    return controller.remove_payment_method(payment_method_id)

