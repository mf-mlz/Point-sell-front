import { Injectable } from '@angular/core';
import { ApiServiceEmployees } from './api.service.employees';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apiServiceEmployees: ApiServiceEmployees) {}

  getUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiServiceEmployees.getDataSession().subscribe({
        next: (response) => {
          resolve(response.data);
        },
        error: (error) => {
          reject(null);
        },
      });
    });
  }
}
