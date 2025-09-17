import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ApiServiceLogout } from './api.service.logout';
import { SwalService } from './swal.service';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private cookieService: CookieService,
    private apiServiceLogout: ApiServiceLogout,
    private swalService: SwalService,
    private socketService: SocketService
  ) {}

  /* Remove SessionStorage => Payload */
  /* Unsuscribe => Nav (Pendiente) */
  public clearPayloadFromSession() {
    /* Clear Cookie => Backend */
    const sessionData = sessionStorage.getItem('session-employee') || null;
    if (sessionData) {
      this.apiServiceLogout.logout({ sessionData }).subscribe({
        next: (response) => {
          sessionStorage.clear();
          this.cookieService.delete('token');

          this.swalService.showToast(
            'success',
            response.message,
            '',
            'text',
            () => {}
          );
        },
        error: (error) => {
          this.swalService.showToast(
            'error',
            'Error',
            error.error?.message || 'Ocurrió un Error',
            'text',
            () => {}
          );
        },
      });

      this.socketService.disconnect();
    } else {
      this.swalService.showToast(
        'error',
        'Error',
        'Ocurrió un Error al Cerrar la Sesión',
        'text',
        () => {}
      );
    }
  }
}
