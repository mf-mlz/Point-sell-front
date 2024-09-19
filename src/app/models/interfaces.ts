/* User Payload */

export interface userPayload {
  id: number;
  name: string;
  email: string;
  phone: string;
  role_id: number;
  role_name: string;
  iat: number;
  exp: number;
}

/* Products Interfaces */

export interface DeleteProductRequest {
  id: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  photo: string;
  key_sat: string;
}

export interface Category {
  category: string;
}

export interface KeySat {
  clave: string;
  descripcion: string;
}

/* Sales */
export interface SaleDate {
  dateBefore: string;
  dateAfter: string;
}

export interface Sale {
  id: number;
  date: string;
  totalAmount: number;
  payment: number;
  dataPayment: string;
  customerId: number;
  employeesId: number;
  status: string;
  created_at: string;
  updated_at: string;
}
