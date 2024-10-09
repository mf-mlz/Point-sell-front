import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductFilterData } from '../models/interfaces';
import { AuthHeaderService } from './auth-header.service';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceProducts {
  private apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) {}

  /* Get  */
  allProducts(): Observable<any> {
    const url = `${this.apiUrl}/products`;
    return this.http.get(url, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }

  allCategories(): Observable<any> {
    const url = `${this.apiUrl}/products/categories`;
    return this.http.get(url, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }

  allKeySat(): Observable<any> {
    const url = `${this.apiUrl}/products/keySat`;
    return this.http.get(url, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }

  /* Post */
  uploadFile(formData: FormData): Observable<any> {
    const url = `${this.apiUrl}/products/upload`;
    return this.http.post(url, formData, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }

  filterProducts(filters: ProductFilterData): Observable<any> {
    const url = `${this.apiUrl}/products/filter`;
    return this.http.post(url, filters, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }

  registerProducts(credentials: {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    photo: string;
  }): Observable<any> {
    const url = `${this.apiUrl}/products/register`;
    return this.http.post(url, credentials, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }

  /* Put */
  editProduct(credentials: {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    photo: string;
  }): Observable<any> {
    const url = `${this.apiUrl}/products/edit`;
    return this.http.put(url, credentials, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }

  /* Delete */
  deleteProduct(credentials: { id: number }): Observable<any> {
    const url = `${this.apiUrl}/products/delete/${credentials.id}`;
    return this.http.delete(url, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }
}
