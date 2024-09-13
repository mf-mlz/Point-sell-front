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
