import type { Category } from "./category";
import type { PaymentMethod } from "./paymentMethod";

export interface Transaction {
  id: number;
  personID: number;
  categoryID: number;
  paymentMethodID: number;
  date: string; // ISO string from DateTime
  amount: number; // Positive = income, Negative = expense
}

export interface TransactionCreate {
  personID: number;
  categoryID: number;
  paymentMethodID: number;
  amount: number;
  date?: string;
}

export interface TransactionResponse extends Transaction {
  category?: Category;
  payment_method?: PaymentMethod;
}