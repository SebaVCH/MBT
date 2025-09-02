from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import mapped_column, relationship

from internal.domain import Base

# PaymentMethod corresponde al modelo de los metodos de pago que corresponden a las transacciones
class PaymentMethod(Base):
    __tablename__ = 'paymentMethod'
    id = mapped_column(Integer, primary_key=True, autoincrement=True)
    name = mapped_column(String, unique=True)
    personID = mapped_column(Integer, ForeignKey('person.id'))

    person = relationship("Person", back_populates="payment_methods")
    transactions = relationship("Transaction", back_populates="payment_method")