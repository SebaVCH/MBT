from sqlalchemy.orm import Session, joinedload
from internal.domain.category import Category

# Repositorio de Categorías (interaccion con la base de datos)
class CategoryRepository:
    def __init__(self, db: Session):
        self.db = db
    def get_all_categories(self):
        return self.db.query(Category).options(joinedload(Category.person)).all()
