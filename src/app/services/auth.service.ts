import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { loginUserEncrypt } from '../models/interfaces';
import { environment } from '../../environments/environment';
import { ApiServiceLogout } from './api.service.logout';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private cookieService: CookieService, private apiServiceLogout:ApiServiceLogout) {}


  /* Remove SessionStorage => Payload */
  /* Unsuscribe => Nav (Pendiente) */
  public clearPayloadFromSession() {
    sessionStorage.clear();
    this.cookieService.delete('token');

    /* Clear Cookie => Backend */
    this.apiServiceLogout.logout().subscribe({
      next: (response) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: 'success',
          title: response.message,
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Ocurrió un Error',
        });
      },
    });

  }
}
