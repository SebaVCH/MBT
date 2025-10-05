from pydantic import BaseModel
from datetime import datetime

class TransactionBase(BaseModel):
    amount: int
    description: str | None = None

class TransactionCreate(TransactionBase):
    categoryID: int
    paymentMethodID: int | None = None

class TransactionResponse(TransactionBase):
    id: int
    personID: int
    categoryID: int
    paymentMethodID: int | None
    date: datetime

    class Config:
        from_attributes = True

class WithdrawRequest(BaseModel):
    amount: int
    categoryID: int
    paymentMethodID: int
    description: str | None = None
