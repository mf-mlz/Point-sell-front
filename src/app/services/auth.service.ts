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
    sessionStorage.clear();
    this.cookieService.delete('token');

    /* Clear Cookie => Backend */
    this.apiServiceLogout.logout().subscribe({
      next: (response) => {
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
  }
}
