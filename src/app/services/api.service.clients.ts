import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { loginUser } from '../models/interfaces';
import { AuthHeaderService } from './auth-header.service';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceClients {


  private apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) { }

  /* Get  */
  getAllClients(): Observable<any> {
    const url = `${this.apiUrl}/clients`;
    return this.http.get(url, { headers: this.authHeaderService.getHeaders(), withCredentials: true });
  }

  filterClients(filters: { search?: string }): Observable<any> {
    const url = `${this.apiUrl}/clients/filter`;
    return this.http.post(url, filters, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }

  registerClients(formData: FormData): Observable<any> {
    const url = `${this.apiUrl}/clients/register`;
    return this.http.post(url, formData, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }

  editClients(credentials: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    zip: number;
    tax_id: string;
    tax_system: number;
  }): Observable<any> {
    const url = `${this.apiUrl}/clients/edit`;
    return this.http.put(url, credentials, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }

  deleteClients(credentials: { id: number }): Observable<any> {
    const url = `${this.apiUrl}/clients/delete/${credentials.id}`;
    return this.http.delete(url, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }
}
