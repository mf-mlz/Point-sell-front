import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { loginUserEncrypt } from '../models/interfaces';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';
import { ApiServiceLogout } from './api.service.logout';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private secretKey = environment.secret_key;
  constructor(private cookieService: CookieService, private apiServiceLogout:ApiServiceLogout) {}

  /* Get Payload => and add in Session Storage */
  public saveSessionStorage(data: loginUserEncrypt): any {
    if (data) {
      try {
        sessionStorage.setItem('data', data.data);
      } catch (error) {
        return false;
      }
    } else {
      return null;
    }
  }

  /* Get SessionStorage Payload */
  public getDecodedToken() {
    const user = sessionStorage.getItem('data');
    if(user){
      const decryptedData = CryptoJS.AES.decrypt(user, this.secretKey);
      const decryptedPayload = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
      return user ? decryptedPayload : null;
    }
    
  }

  
  public getPayloadEncript() {
    const data = sessionStorage.getItem('data');
    return data || null;
  }

  /* Remove SessionStorage => Payload */
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
