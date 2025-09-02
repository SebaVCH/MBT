from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import mapped_column, relationship

from internal.domain import Base

# Category corresponde al modelo de las categorias que corresponden a las transacciones
class Category(Base):
    __tablename__ = 'category'
    id = mapped_column(Integer, primary_key=True, autoincrement=True)
    name = mapped_column(String, unique=True)
    personID = mapped_column(Integer, ForeignKey('person.id'))

    person = relationship("Person", back_populates="categories")
    transactions = relationship("Transaction", back_populates="category")