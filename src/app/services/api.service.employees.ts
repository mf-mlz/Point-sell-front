import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceEmployees {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  /* Post -- Login */
  login(credentials: { email: string, password: string }): Observable<any> {
    const url = `${this.apiUrl}/employees/login`;
    return this.http.post(url, credentials);
  }


  /* Get Headers */
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    const userPayload = this.authService.getDecodedToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      employeeId: userPayload.id,
    });
  }

  /* Get -- All Employees */
  allEmployees(): Observable<any> {
    const url = `${this.apiUrl}/employees`;
    const headers = this.getHeaders();
    return this.http.get(url, { headers });
  }

  /* Post -- Filter Employees */
  filterEmployeesAll(filters: { search?: string }): Observable<any> {
    const url = `${this.apiUrl}/employees/filterAll`;
    const headers = this.getHeaders();
    return this.http.post(url, filters, { headers });
  }

  /* Put -- Edit Product */
  editEmployee(credentials: {
    id: number,
    name: string,
    email: string,
    password: string,
    phone: number,
    address: string,
    role_id: number
  }): Observable<any> {
    const url = `${this.apiUrl}/employees/edit`;
    const headers = this.getHeaders();
    return this.http.put(url, credentials, { headers });
  }

  /* Post -- Register Products */
  registerProducts(credentials: {
    name: string,
    email: string,
    password: string,
    phone: number,
    address: string,
    idid: number
  }): Observable<any> {
    const url = `${this.apiUrl}/employees/register`;
    const headers = this.getHeaders();
    return this.http.post(url, credentials, { headers });
  }



  /* Delete -- Delete Product:Id */
  deleteEmployee(credentials: { id: number }): Observable<any> {
    const url = `${this.apiUrl}/employees/delete`;
    const headers = this.getHeaders();
    return this.http.delete(url, { headers, body: credentials });
  }
}
