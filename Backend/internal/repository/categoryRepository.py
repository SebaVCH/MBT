from sqlalchemy.orm import Session, joinedload
from internal.domain.category import Category

# Repositorio de Categorías (interaccion con la base de datos)
class CategoryRepository:
    def __init__(self, db: Session):
        self.db = db
    def get_all_categories(self):
        return (self.db.query(Category).options(
            joinedload(Category.person))
            .all()
        )

    def create_category(self,category_data):
        newCategory = Category(**category_data)
        self.db.add(newCategory)
        self.db.commit()
        self.db.refresh(newCategory)
        return newCategory

    def remove_category(self, category_id):
        category = self.db.query(Category).filter(Category.id == category_id).first()
        if category:
            self.db.delete(category)
            self.db.commit()
            return True
        return False