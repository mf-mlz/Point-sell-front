import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthHeaderService {
  constructor(private authService: AuthService) {}

  getHeaders(): HttpHeaders {
    const data = this.authService.getPayloadEncript();
    if (data) {
      return new HttpHeaders({ 'session-employee': data });
    }
    return new HttpHeaders();
  }
}
