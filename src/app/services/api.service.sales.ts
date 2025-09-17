import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TransactionSale } from '../models/interfaces';
import { AuthHeaderService } from './auth-header.service';
@Injectable({
  providedIn: 'root',
})
export class ApiServiceSales {
  private apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) {}

  /* Post */
  postSaleDate(filters: {
    dateBefore: string;
    dateAfter: string;
  }): Observable<any> {
    const url = `${this.apiUrl}/sales/postSaleDate`;
    return this.http.post(url, filters, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }

  addSale(credentials: TransactionSale): Observable<any> {
    const url = `${this.apiUrl}/sales/register`;
    return this.http.post(url, credentials, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }

  /* Get */
  getAllSales(): Observable<any> {
    const url = `${this.apiUrl}/sales`;
    return this.http.get(url, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }

  getSaleById(idSale: string): Observable<any> {
    const url = `${this.apiUrl}/sales/getSaleById/${idSale}`;
    return this.http.get(url, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
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
    return this.http.put(url, credentials, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }

  /* Delete */
  deleteSale(credentials: { id: number }): Observable<any> {
    const url = `${this.apiUrl}/sales/delete/${credentials.id}`;
    return this.http.delete(url, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }
}
