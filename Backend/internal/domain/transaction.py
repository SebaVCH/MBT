import datetime
from sqlalchemy import Integer, ForeignKey, DateTime, String
from sqlalchemy.orm import mapped_column, relationship
from internal.domain import Base

# Transaction corresponde al modelo de las transacciones que realizan las personas
class Transaction(Base):
    __tablename__ = 'transaction'
    id = mapped_column(Integer, primary_key=True, autoincrement=True)
    personID = mapped_column(Integer, ForeignKey('person.id'))
    categoryID = mapped_column(Integer, ForeignKey('category.id'))
    paymentMethodID = mapped_column(Integer, ForeignKey('paymentMethod.id'))
    date = mapped_column(DateTime, default=datetime.datetime.now)
    amount = mapped_column(Integer)
    description = mapped_column(String(255), nullable=True)

    person = relationship("Person", back_populates="transactions")
    category = relationship("Category", back_populates="transactions")
    payment_method = relationship("PaymentMethod", back_populates="transactions")