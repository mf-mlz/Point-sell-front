import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

export const ModuleGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    const dataToken = authService.getDecodedToken();
    if (environment.name_role !== dataToken.role_name) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: true,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: 'error',
        title: '¡Acceso Denegado!',
        text: 'No tienes Permisos para acceder a esa ruta',
      });
      router.navigate(['/dashboard']);
      return false;
    } else {
      return true;
    }
  } catch (err) {
    return false;
  }
};
