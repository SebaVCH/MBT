from pydantic import BaseModel

class PaymentMethodCreate(BaseModel):
    name: str

class PaymentMethodResponse(BaseModel):
    id: int
    name: str
    personID: int

    class Config:
        from_attributes = True
