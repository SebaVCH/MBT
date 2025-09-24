export interface CategoryResponse {
  id: number;
  name: string;
  personId: number;
  // Añade otros campos que veas en tu CategorySchema
}

export interface CategoryCreate {
  id: number;
  name: string;
  personID: number;
  
  // Añade los campos necesarios para crear una categoría
}

export interface Category {
  id: number;
  name: string;
  personID: number;
}