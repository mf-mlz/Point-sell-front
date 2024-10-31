import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthHeaderService } from './auth-header.service';
import { InvoiceSendEmail } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceInvoice {
  private apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) {}

  /* Post */
  createInvoice(credentials: {
    customer: Number;
    id_sale: Number;
    employee: string;
  }): Observable<any> {
    const url = `${this.apiUrl}/invoices/create`;
    return this.http.post(url, credentials, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }

  downloadInvoice(credentials: { id_invoice: string }): Observable<Blob> {
    const url = `${this.apiUrl}/invoices/download/${credentials.id_invoice}`;
    return this.http.get(url, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
      responseType: 'blob',
    });
  }

  cancelInvoice(credentials: {
    id_invoice: string;
    employee: string;
    motive: string;
  }): Observable<any> {
    const url = `${this.apiUrl}/invoices/cancel`;
    return this.http.post(url, credentials, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }

  invoicesByIdSale(credentials: { id_sale: number }): Observable<any> {
    const url = `${this.apiUrl}/invoices/getByIdSale/${credentials.id_sale}`;
    return this.http.get(url, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }

  sendEmail(filters: InvoiceSendEmail): Observable<any> {
    const url = `${this.apiUrl}/invoices/sendEmail`;
    return this.http.post(url, filters, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  } 

}


