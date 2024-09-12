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
  public userPayload = this.authService.getDecodedToken();

  constructor(private http: HttpClient, private authService: AuthService) {}

  /* Get -- All Products */
  allProducts(): Observable<any> {
    const url = `${this.apiUrl}/products`;
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      employeeId: this.userPayload.id,
    });
    return this.http.get(url, { headers });
  }

  /* Get -- All Categories */
  allCategories(): Observable<any> {
    const url = `${this.apiUrl}/products/categories`;
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      employeeId: this.userPayload.id,
    });
    return this.http.get(url, { headers });
  }

  /* Get -- All Key Sat */
  allKeySat(): Observable<any> {
    const url = `${this.apiUrl}/products/keySat`;
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      employeeId: this.userPayload.id,
    });
    return this.http.get(url, { headers });
  }

  /* Post -- Upload File */
  uploadFile(formData: FormData): Observable<any> {
    const url = `${this.apiUrl}/products/upload`;
    const token = this.authService.getToken();
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      employeeId: this.userPayload.id,
    });

  
    return this.http.post(url, formData, { headers });
  }

  /* Post -- Filter Products */
  filterProducts(filters: { id?: string, name?: string }): Observable<any> {
    const url = `${this.apiUrl}/products/filter`;
    const token = this.authService.getToken();
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      employeeId: this.userPayload.id,
    });

    return this.http.post(url, filters, { headers });
  }
  
    /* Post -- Register Products */
    registerProducts(credentials: { id: number, name: string, description: string, price: number, category: string, stock: number, photo: string}): Observable<any> {
      const url = `${this.apiUrl}/products/register`;
      const token = this.authService.getToken();
    
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        employeeId: this.userPayload.id,
      });
  
      return this.http.post(url, credentials, { headers });
    }

  /* Put -- Edit Product */
  editProduct(credentials: { id: number, name: string, description: string, price: number, category: string, stock: number, photo: string }): Observable<any> {
    const url = `${this.apiUrl}/products/edit`;
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      employeeId: this.userPayload.id,
    });

    return this.http.put(url, credentials, { headers });
  }

  /* Delete -- Delete Product:Id */
  deleteProduct(credentials: { id: number }): Observable<any> {
    const url = `${this.apiUrl}/products/delete`;
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      employeeId: this.userPayload.id,
    });

    return this.http.delete(url, { headers, body: credentials });
  }
}
