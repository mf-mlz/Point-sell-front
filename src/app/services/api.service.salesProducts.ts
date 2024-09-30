import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { HttpHeadersService } from './http-headers.service';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceSalesProducts {
  private apiUrl = environment.apiUrl;
  public userPayload = this.authService.getDecodedToken();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private httpHeadersService: HttpHeadersService
  ) {}

  /* Post  -- Filter */
  postFilterDescription(credentials: { salesId: Number }): Observable<any> {
    const url = `${this.apiUrl}/salesproducts/filterDescription`;

    const headers = this.httpHeadersService.getHeaders();
    return this.http.post(url, credentials, { headers });
  }
}
