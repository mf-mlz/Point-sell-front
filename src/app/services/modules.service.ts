import { Injectable } from '@angular/core';
import { ApiServiceEmployees } from './api.service.employees';

@Injectable({
  providedIn: 'root',
})
export class ModulesService {
  constructor(private apiServiceEmployees: ApiServiceEmployees) {}

  getModules(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiServiceEmployees.getModulesSession().subscribe({
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
