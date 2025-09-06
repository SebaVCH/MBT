from internal.repository.paymentMethodRepository import PaymentMethodRepository


class PaymentMethodUseCase:
    def __init__(self, repository: PaymentMethodRepository):
        self.repository = repository

    def get_all_payment_methods(self):
        return self.repository.get_all_payment_methods()

    def create_payment_method(self, payment_method_data):
        return self.repository.create_payment_method(payment_method_data)

    def remove_payment_method(self, payment_method_id):
        return self.repository.remove_payment_method(payment_method_id)
