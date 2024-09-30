import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { HttpHeadersService } from './http-headers.service';

@Injectable({
  providedIn: 'root',
})
export class ApiServicePaymentForms {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private httpHeadersService: HttpHeadersService
  ) {}

  /* Get -- All Payment Forms */
  getallPaymentsForm(): Observable<any> {
    const url = `${this.apiUrl}/paymentsform`;
    const headers = this.httpHeadersService.getHeaders();
    return this.http.get(url, { headers });
  }
}
