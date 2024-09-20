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

// Sale
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

// Employees
export interface Employee {
  id: number;
  
  name: string;
  email: string;
  password: string;
  phone: number;
  address: string;
  status: string;
  role_id: number;
  created_at: string;
  updated_at: string;
}