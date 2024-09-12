import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceProducts {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient, private authService: AuthService) {}

  /* Get Headers */
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    const userPayload = this.authService.getDecodedToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      employeeId: userPayload.id,
    });
  }
  
  /* Get -- All Products */
  allProducts(): Observable<any> {
    
    const url = `${this.apiUrl}/products`;
    
    const headers = this.getHeaders();
    return this.http.get(url, { headers });
  }

  /* Get -- All Categories */
  allCategories(): Observable<any> {
    const url = `${this.apiUrl}/products/categories`;
    
    const headers = this.getHeaders();
    return this.http.get(url, { headers });
  }

  /* Get -- All Key Sat */
  allKeySat(): Observable<any> {
    const url = `${this.apiUrl}/products/keySat`;
    
    const headers = this.getHeaders();
    return this.http.get(url, { headers });
  }

  /* Post -- Upload File */
  uploadFile(formData: FormData): Observable<any> {
    const url = `${this.apiUrl}/products/upload`;
    
    const headers = this.getHeaders();
    return this.http.post(url, formData, { headers });
  }

  /* Post -- Filter Products */
  filterProducts(filters: { id?: string, name?: string }): Observable<any> {
    const url = `${this.apiUrl}/products/filter`;
    
    const headers = this.getHeaders();
    return this.http.post(url, filters, { headers });
  }
  
    /* Post -- Register Products */
    registerProducts(credentials: { id: number, name: string, description: string, price: number, category: string, stock: number, photo: string}): Observable<any> {
      const url = `${this.apiUrl}/products/register`;
      
      const headers = this.getHeaders();
      return this.http.post(url, credentials, { headers });
    }

  /* Put -- Edit Product */
  editProduct(credentials: { id: number, name: string, description: string, price: number, category: string, stock: number, photo: string }): Observable<any> {
    const url = `${this.apiUrl}/products/edit`;
    
    const headers = this.getHeaders();
    return this.http.put(url, credentials, { headers });
  }

  /* Delete -- Delete Product:Id */
  deleteProduct(credentials: { id: number }): Observable<any> {
    const url = `${this.apiUrl}/products/delete`;

    const headers = this.getHeaders();
    return this.http.delete(url, { headers, body: credentials });
  }
}
