import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { ApiServiceReset } from '../services/api.service.reset';
import { AuthService } from '../services/auth.service';
import { SwalService } from '../services/swal.service';

export const ResetGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const apiServiceValidate = inject(ApiServiceReset);
  const authService = inject(AuthService);
  const swalService = inject(SwalService);
  const token = route.params['token'];

  try {
    const data = await isTokenValid(apiServiceValidate, token);
    if (data.status) {
      return true;
    } else {
      swalService.showFire(
        'error',
        'Error',
        '<b>Token inválido o expirado. Por favor solicita un nuevo enlace para restablecer la contraseña.</b>',
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
      '<b>Token inválido o expirado. Por favor solicita un nuevo enlace para restablecer la contraseña.</b>',
      'html',
      () => {
        authService.clearPayloadFromSession(), router.navigate(['/login']);
      }
    );
    return false;
  }
};

/* Validate JWT and (Payload) */
const isTokenValid = (
  apiServiceValidate: ApiServiceReset,
  token: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const data = {
      token: token,
    };
    apiServiceValidate.validateTokenReset(data).subscribe({
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
