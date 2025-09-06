from internal.repository.categoryRepository import CategoryRepository

# Casos de uso para categorías
class CategoryUseCase:
    def __init__(self, repository: CategoryRepository):
        self.repository = repository

    def get_all_categories(self):
        return self.repository.get_all_categories()

    def create_category(self, category_data):
        return self.repository.create_category(category_data)

    def remove_category(self, category_id):
        return self.repository.remove_category(category_id)