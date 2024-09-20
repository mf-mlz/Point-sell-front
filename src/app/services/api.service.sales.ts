import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceSales {
  private apiUrl = environment.apiUrl;
  public userPayload = this.authService.getDecodedToken();

  constructor(private http: HttpClient, private authService: AuthService) { }


  public getSaleDate(filters: { dateBefore: string, dateAfter: string }): Observable<any> {
    const url = `${this.apiUrl}/sales/getSaleDate`;
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      employeeId: this.userPayload.id,
    });

    return this.http.post(url, filters, { headers });

  }

  public getAllSales(): Observable<any> {
    const url = `${this.apiUrl}/sales`;
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      employeeId: this.userPayload.id,
    });

    return this.http.get(url, { headers });

  }


}
