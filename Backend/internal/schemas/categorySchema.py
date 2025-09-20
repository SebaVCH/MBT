from pydantic import BaseModel

class CategoryCreate(BaseModel):
    name: str
    personID: int

class CategoryResponse(BaseModel):
    id: int
    name: str
    personID: int

    class Config:
        from_attributes = True