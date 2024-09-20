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

/* Sale Info */
export interface SaleInfoComplete {
  id: number;              
  payment: number;         
  customerId: number;      
  employeesId: number;     
  status: string;          
  date: string;            
  totalAmount: number;     
  typePayment: string;     
  dataPayment: string;     
  nameClient: string;      
  emailClient: string;     
  taxIdClient: string;     
  taxSystemClient: number; 
  nameEmployee: string;    
  emailEmployee: string;
}

/* Forms Payment */
export interface PaymentForm {
  id: number;
  descripcion: string;
  created_at: Date;  
  updated_at: Date;  
}

/* Datatable */
export interface ButtonConfig {
  class: string;
  icon: string;
  title: string;
  action: (element: any) => void;
}

/* Employees */
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
