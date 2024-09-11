import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceEmployees {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /* Post -- Login */
  login(credentials: { email: string, password: string }): Observable<any> {
    const url = `${this.apiUrl}/employees/login`;
    return this.http.post(url, credentials);
  }
}
