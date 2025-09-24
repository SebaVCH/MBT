
export interface PaymentMethod {
  id: number;
  name: string;
  personID: number;
}

export interface PaymentMethodCreate {
  name: string;
  personID: number;
}