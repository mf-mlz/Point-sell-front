import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiServicePaymentForms {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {}

  /* Get  */
  getallPaymentsForm(): Observable<any> {
    const url = `${this.apiUrl}/paymentsform`;
    return this.http.get(url, { withCredentials: true });
  }
}
