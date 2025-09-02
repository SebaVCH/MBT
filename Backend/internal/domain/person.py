from sqlalchemy import Integer, String
from sqlalchemy.orm import mapped_column, relationship
from internal.domain import Base

# Person corresponde al modelo de las personas que usan la aplicacion
class Person(Base):
    __tablename__ = 'person'
    id = mapped_column(Integer, primary_key=True, autoincrement=True)
    email = mapped_column(String, unique=True)
    name = mapped_column(String)
    password = mapped_column(String)
    balance = mapped_column(Integer, default=0)

    categories = relationship("Category", back_populates="person", cascade="all, delete-orphan")
    payment_methods = relationship("PaymentMethod", back_populates="person", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="person", cascade="all, delete-orphan")