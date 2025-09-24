
export interface Person {
  id: number;
  email: string;
  name: string;
  password: string;
  balance: number;
}

export interface PersonCreate {
  email: string;
  name: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}