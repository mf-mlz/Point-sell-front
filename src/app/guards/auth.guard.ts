import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiServiceValidate } from '../services/api.service.validate';
import { AuthService } from '../services/auth.service';
import { SwalService } from '../services/swal.service';

export const AuthGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const apiServiceValidate = inject(ApiServiceValidate);
  const authService = inject(AuthService);
  const swalService = inject(SwalService);

  try {
    const data = await isTokenValid(apiServiceValidate);
    if (data.status) {
      return true;
    } else {
      swalService.showFire(
        'error',
        'Error',
        '<b>No estás autenticado. Redirigiendo al login...</b>',
        'html',
        () => {
          authService.clearPayloadFromSession(), router.navigate(['/login']);
        }
      );

      return false;
    }
  } catch (error) {
    swalService.showFire(
      'error',
      'Error',
      '<b>No estás autenticado. Redirigiendo al login...</b>',
      'html',
      () => {
        authService.clearPayloadFromSession(), router.navigate(['/login']);
      }
    );
    return false;
  }
};

/* Validate JWT and (Payload) */
const isTokenValid = (apiServiceValidate: ApiServiceValidate): Promise<any> => {
  return new Promise((resolve, reject) => {
    apiServiceValidate.validate().subscribe({
      next: (response) => {
        if (response && response.status) {
          resolve(response);
        } else {
          reject(false);
        }
      },
      error: () => {
        reject(false);
      },
    });
  });
};
