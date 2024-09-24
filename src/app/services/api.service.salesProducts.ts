import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceSalesProducts {
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

  /* Post  -- Filter */
  postFilterDescription(credentials: {
    salesId: Number
  }): Observable<any> {
    const url = `${this.apiUrl}/salesproducts/filterDescription`;

    const headers = this.getHeaders();
    return this.http.post(url, credentials, { headers });
  }
}
