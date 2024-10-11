import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { loginUser } from '../models/interfaces';
import { AuthHeaderService } from './auth-header.service';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceRoles {
  private apiUrl = environment.apiUrl;
  private user: loginUser | null = null;

  constructor(private http: HttpClient, private authHeaderService: AuthHeaderService) { }

  /* Get  */
  getAllRoles(): Observable<any> {
    const url = `${this.apiUrl}/roles`;
    return this.http.get(url, { headers: this.authHeaderService.getHeaders(), withCredentials: true });
  }
}
