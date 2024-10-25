import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ApiServiceForgot {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  public recoverPassword(credentials: {
    email: string;
  }): Observable<any> {
    const url = `${this.apiUrl}/employees/recover`;
    return this.http.post(url, credentials, { withCredentials: true });
  }
}
