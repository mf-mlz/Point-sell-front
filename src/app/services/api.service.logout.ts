import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceLogout {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /* Post */
  logout(): Observable<any> {
    const url = `${this.apiUrl}/employees/logout`;
    return this.http.post(url, {});
  }
}
