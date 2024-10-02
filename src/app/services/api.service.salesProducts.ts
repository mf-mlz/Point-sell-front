import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceSalesProducts {
  private apiUrl = environment.apiUrl;
  
  constructor(
    private http: HttpClient
  ) {}

  /* Post  */
  postFilterDescription(credentials: { salesId: Number }): Observable<any> {
    const url = `${this.apiUrl}/salesproducts/filterDescription`;
    return this.http.post(url, credentials, { withCredentials: true });
  }
}
