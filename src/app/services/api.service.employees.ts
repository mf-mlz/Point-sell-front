import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthHeaderService } from './auth-header.service';
import { Employee, EmployeeFilter } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceEmployees {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) {}

  /* Post */
  login(credentials: { email: string; password: string }): Observable<any> {
    const url = `${this.apiUrl}/employees/login`;
    return this.http.post(url, credentials, { withCredentials: true });
  }

  logout(): Observable<any> {
    const url = `${this.apiUrl}/employees/logout`;
    return this.http.post(url, {});
  }

  filterEmployeesAll(filters: { search?: string }): Observable<any> {
    const url = `${this.apiUrl}/employees/filterAll`;
    return this.http.post(url, filters, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }
  
  filter(filters: EmployeeFilter): Observable<any> {
    const url = `${this.apiUrl}/employees/filter`;
    return this.http.post(url, filters, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }

  registerEmployee(credentials: Employee): Observable<any> {
    const url = `${this.apiUrl}/employees/register`;
    return this.http.post(url, credentials, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }

  /* Get */
  allEmployees(): Observable<any> {
    const url = `${this.apiUrl}/employees`;
    return this.http.get(url, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }

  getRoles(): Observable<any> {
    const url = `${this.apiUrl}/roles/get`;
    return this.http.get(url, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }

  /* Put */
  editEmployee(credentials: Employee): Observable<any> {
    const url = `${this.apiUrl}/employees/edit`;
    return this.http.put(url, credentials, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }

  /* Delete  */
  deleteEmployee(credentials: { id: number }): Observable<any> {
    const url = `${this.apiUrl}/employees/delete/${credentials.id}`;
    return this.http.delete(url, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }
}
