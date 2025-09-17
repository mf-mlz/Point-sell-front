import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthHeaderService {
  constructor() {}

  getHeaders(): HttpHeaders {
    const data = sessionStorage.getItem('session-employee');
    if (data) {
      return new HttpHeaders({ 'session-employee': data });
    }
    return new HttpHeaders();
  }
}
