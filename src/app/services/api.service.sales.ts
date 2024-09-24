import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceSales {
  private apiUrl = environment.apiUrl;
  public userPayload = this.authService.getDecodedToken();

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
  editProduct(credentials: {
    id: Number;
    date: string;
    payment: Number;
    dataPayment: Number;
    totalAmount: Number;
    customerId: Number;
    employeesId: Number;
    status: Number;
  }): Observable<any> {
    const url = `${this.apiUrl}/sales/edit`;

    const headers = this.getHeaders();
    return this.http.put(url, credentials, { headers });
  }

  /* Delete */
  deleteSale(credentials: { id: number }): Observable<any> {
    const url = `${this.apiUrl}/sales/delete`;

    const headers = this.getHeaders();
    return this.http.delete(url, { headers, body: credentials });
  }
}
