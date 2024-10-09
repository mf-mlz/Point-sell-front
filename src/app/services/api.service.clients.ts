import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { loginUser } from '../models/interfaces';
import { AuthHeaderService } from './auth-header.service';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceClients {
  private apiUrl = environment.apiUrl;
  private user: loginUser | null = null;

  constructor(private http: HttpClient, private authHeaderService: AuthHeaderService) { }

  /* Get  */
  getAllClients(): Observable<any> {
    const url = `${this.apiUrl}/clients`;
    return this.http.get(url, { headers: this.authHeaderService.getHeaders(), withCredentials: true });
  }
}
