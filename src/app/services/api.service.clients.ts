import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ApiServiceClients {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /* Get  */
  getAllClients(): Observable<any> {
    const url = `${this.apiUrl}/clients`;
    return this.http.get(url, { withCredentials: true });
  }

  
}
