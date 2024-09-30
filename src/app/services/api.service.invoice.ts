import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { HttpHeadersService } from './http-headers.service';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceInvoice {
  private apiUrl = environment.apiUrl;
  public userPayload = this.authService.getDecodedToken();

  constructor(private http: HttpClient, private authService: AuthService, private httpHeadersService: HttpHeadersService) {}


  /* Post */
  createInvoice(credentials: {
    customer: Number;
    id_sale: Number;
    id_employee: Number;
  }): Observable<any> {
    const url = `${this.apiUrl}/invoices/create`;

    const headers = this.httpHeadersService.getHeaders();
    return this.http.post(url, credentials, { headers });
  }

  downloadInvoice(credentials: { id_invoice: string }): Observable<Blob> {
    const url = `${this.apiUrl}/invoices/download`;
    const headers = this.httpHeadersService.getHeaders();
    return this.http.post(url, credentials, { headers, responseType: 'blob' });
  }

  cancelInvoice(credentials: {
    id_invoice: string;
    id_employee: number;
    motive: string;
  }): Observable<any> {
    const url = `${this.apiUrl}/invoices/cancel`;

    const headers = this.httpHeadersService.getHeaders();
    return this.http.post(url, credentials, { headers });
  }

  invoicesByIdSale(credentials: {
    id_sale: number;
  }): Observable<any> {
    const url = `${this.apiUrl}/invoices/getByIdSale`;
    const headers = this.httpHeadersService.getHeaders();
    return this.http.post(url, credentials, { headers });
  }

}
