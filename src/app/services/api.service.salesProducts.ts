import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthHeaderService } from './auth-header.service';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceSalesProducts {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) {}

  /* Post  */
  postFilterDescription(credentials: { salesId: Number }): Observable<any> {
    const url = `${this.apiUrl}/salesproducts/filterDescription`;
    return this.http.post(url, credentials, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }
}
