import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResetVerify } from '../models/interfaces';
@Injectable({
  providedIn: 'root',
})
export class ApiServiceReset {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {}

  /* Post */
  validateTokenReset(credentials: ResetVerify): Observable<any> {
    const url = `${this.apiUrl}/employees/verifyTokenReset`;
    return this.http.post(url, credentials);
  }
}
