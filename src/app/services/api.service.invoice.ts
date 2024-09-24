import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceInvoice {
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

  /* Post */
  createInvoice(credentials: {
    customer: Number;
    id_sale: Number;
    id_employee: Number;
  }): Observable<any> {
    const url = `${this.apiUrl}/invoices/create`;

    const headers = this.getHeaders();
    return this.http.post(url, credentials, { headers });
  }

  downloadInvoice(credentials: { id_invoice: string }): Observable<Blob> {
    const url = `${this.apiUrl}/invoices/download`;
    const headers = this.getHeaders();
    return this.http.post(url, credentials, { headers, responseType: 'blob' });
  }

  cancelInvoice(credentials: {
    id_invoice: string;
    id_employee: number;
    motive: string;
  }): Observable<any> {
    const url = `${this.apiUrl}/invoices/cancel`;

    const headers = this.getHeaders();
    return this.http.post(url, credentials, { headers });
  }

  invoicesByIdSale(credentials: {
    id_sale: number;
  }): Observable<any> {
    const url = `${this.apiUrl}/invoices/getByIdSale`;
    const headers = this.getHeaders();
    return this.http.post(url, credentials, { headers });
  }

}
