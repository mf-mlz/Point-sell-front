import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthHeaderService } from './auth-header.service';
import { Permissions, objPermissionsByRole } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceModules {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) {}

  /* Post */
  register(credentials: Permissions): Observable<any> {
    const url = `${this.apiUrl}/permissions/register`;
    return this.http.post(url, credentials, { withCredentials: true });
  }

  filter(credentials: Permissions): Observable<any> {
    const url = `${this.apiUrl}/permissions/filter`;
    return this.http.post(url, credentials, { withCredentials: true });
  }

  /* Get */
  all(): Observable<any> {
    const url = `${this.apiUrl}/modules`;
    return this.http.get(url, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }

  allModulesAndSubmodules(): Observable<any> {
    const url = `${this.apiUrl}/modules/getModulesAndSubmodules`;
    return this.http.get(url, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }

  getPermissionsByRole(data: objPermissionsByRole): Observable<any> {
    const url = `${this.apiUrl}/permissions/getPermissionsByRole`;
    return this.http.get(url, {
      headers: new HttpHeaders({ 'module-role': JSON.stringify(data) }),
      withCredentials: true,
    });
  }

  getModuleAccessByRole(): Observable<any> {
    const url = `${this.apiUrl}/permissions/getModuleAccessByRole`;
    return this.http.get(url, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }

  /* Put */
  edit(credentials: Permissions): Observable<any> {
    const url = `${this.apiUrl}/permissions/edit`;
    return this.http.put(url, credentials, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }

  /* Delete  */
  delete(credentials: Permissions): Observable<any> {
    const url = `${this.apiUrl}/permissions/delete/${credentials.id}`;
    return this.http.delete(url, {
      headers: this.authHeaderService.getHeaders(),
      withCredentials: true,
    });
  }
}
