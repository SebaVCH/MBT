from internal.repository.categoryRepository import CategoryRepository

# Casos de uso para categorías
class CategoryUseCase:
    def __init__(self, repository: CategoryRepository):
        self.repository = repository

    def get_all_categories(self):
        return self.repository.get_all_categories()