import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthHeaderService } from './auth-header.service';
@Injectable({
  providedIn: 'root',
})
export class ApiServiceValidate {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) {}

  /* Get  */
  validate(): Observable<any> {
    const url = `${this.apiUrl}/validate`;
    return this.http.get(url, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }
}
