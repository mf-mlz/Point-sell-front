import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { TransactionSale } from '../models/interfaces';
import { HttpHeadersService } from './http-headers.service';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceSales {
  private apiUrl = environment.apiUrl;
  public userPayload = this.authService.getDecodedToken();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private httpHeadersService: HttpHeadersService
  ) {}

  hola(): string{
    return "Hola desde api Service SaLE";
    
  }
  /* Get */
  getSaleDate(filters: {
    dateBefore: string;
    dateAfter: string;
  }): Observable<any> {
    const url = `${this.apiUrl}/sales/getSaleDate`;
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      employeeId: this.userPayload.id,
    });

    return this.http.post(url, filters, { headers });
  }

  getAllSales(): Observable<any> {
    const url = `${this.apiUrl}/sales`;
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      employeeId: this.userPayload.id,
    });

    return this.http.get(url, { headers });
  }

  /* Put */
  editSale(credentials: {
    id: Number;
    date: string;
    payment: Number;
    dataPayment: Number;
    totalAmount: Number;
    customerId: Number | null;
    employeesId: Number;
    status: Number;
  }): Observable<any> {
    const url = `${this.apiUrl}/sales/edit`;

    const headers = this.httpHeadersService.getHeaders();
    return this.http.put(url, credentials, { headers });
  }

  /* Delete */
  deleteSale(credentials: { id: number }): Observable<any> {
    const url = `${this.apiUrl}/sales/delete`;
    const headers = this.httpHeadersService.getHeaders();
    return this.http.delete(url, { headers, body: credentials });
  }

  /* Post */
  addSale(credentials: TransactionSale): Observable<any> {
    const url = `${this.apiUrl}/sales/register`;
    const headers = this.httpHeadersService.getHeaders();
    return this.http.post(url, credentials, { headers });
  }
}
