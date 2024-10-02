import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cookieService = inject(CookieService); 
  const token = cookieService.get('token'); 
  

  if (isTokenValid(token)) {
    return true;
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No estás autenticado. Redirigiendo al login...',
    }).then(() => {
      router.navigate(['/login']);
    });
    return false;
  }
};

const isTokenValid = (token: string): boolean => {
  if (!token) {
    return false;
  }

  try {
    const decoded: any = jwtDecode(token);
    const expirationDate = decoded.exp * 1000;
    const now = Date.now();

    return now < expirationDate;
  } catch (error) {
    return false;
  }
};
