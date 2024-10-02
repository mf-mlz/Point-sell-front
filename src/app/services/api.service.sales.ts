import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { TransactionSale } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceSales {
  private apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
  ) {}

  
  /* Post */
  postSaleDate(filters: {
    dateBefore: string;
    dateAfter: string;
  }): Observable<any> {
    const url = `${this.apiUrl}/sales/postSaleDate`;
    return this.http.post(url, filters, { withCredentials: true });
  }

  addSale(credentials: TransactionSale): Observable<any> {
    const url = `${this.apiUrl}/sales/register`;
    return this.http.post(url, credentials, { withCredentials: true });
  }

  /* Get */
  getAllSales(): Observable<any> {
    const url = `${this.apiUrl}/sales`;
    return this.http.get(url, { withCredentials: true });
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
    return this.http.put(url, credentials, { withCredentials: true });
  }

  /* Delete */
  deleteSale(credentials: { id: number }): Observable<any> {
    const url = `${this.apiUrl}/sales/delete${credentials.id}`;
    return this.http.delete(url, { withCredentials: true });
  }

}
