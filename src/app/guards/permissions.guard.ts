import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiServicePermissions } from '../services/api.service.permissions';
import { UserService } from '../services/user.service';
import { objPermissionsByRole } from '../models/interfaces';
import { PermissionsService } from '../services/permissions.service';

export const PermissiosGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const apiServicePermissions = inject(ApiServicePermissions);
  const permissionsService = inject(PermissionsService);
  const userService = inject(UserService);

  try {
    const dataSession = await userService.getUser();
    
    const data = {
      module: route.data['title'],
      role: dataSession.role_name,
    };
    const permissions = await getPermissionsByRole(apiServicePermissions, data);

    if (permissions.status) {
      /* Save Data Permissions Module */
      permissionsService.setPermissions(permissions.data);

      /* Validate Permissions => Access */
      if (permissionsService.getPermissions().access) {
        return true;
      } else {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: true,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: 'error',
          title: '¡Acceso Denegado!',
          html: `<b>No Cuentas con Permisos para Acceder al Módulo [ ${data.module} ]`,
        });
        // router.navigate(['/dashboard']);
        return false;
      }
      /* Permissions Empty */
    } else {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: true,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: 'error',
        title: '¡Acceso Denegado!',
        html: `<b>La Ruta [ ${data.module} ] no cuenta con permisos para tu tipo de Rol.</b>`,
      });
      // router.navigate(['/dashboard']);
      return false;
    }
  } catch (error) {
    return false;
  }
};

/* Get Permissions By Module and Id Role */
const getPermissionsByRole = (
  apiServicePermissions: ApiServicePermissions,
  data: objPermissionsByRole
): Promise<any> => {
  return new Promise((resolve, reject) => {
    apiServicePermissions.getPermissionsByRole(data).subscribe({
      next: (response) => {
        if (response && response.status) {
          resolve(response);
        } else {
          resolve(false);
        }
      },
      error: () => {
        reject(false);
      },
    });
  });
};
