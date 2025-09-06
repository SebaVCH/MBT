from sqlalchemy.orm import joinedload

from internal.domain.paymentMethod import PaymentMethod


class PaymentMethodRepository:
    def __init__(self, db):
        self.db = db

    def get_all_payment_methods(self):
        return (self.db.query(PaymentMethod).options(
            joinedload(PaymentMethod.person),
            joinedload(PaymentMethod.transactions))
            .all()
        )

    def create_payment_method(self, payment_method_data):
        new_payment_method = PaymentMethod(**payment_method_data)
        self.db.add(new_payment_method)
        self.db.commit()
        self.db.refresh(new_payment_method)
        return new_payment_method

    def remove_payment_method(self, payment_method_id):
        payment_method = self.db.query(PaymentMethod).filter(PaymentMethod.id == payment_method_id).first()
        if payment_method:
            self.db.delete(payment_method)
            self.db.commit()
            return True
        return False