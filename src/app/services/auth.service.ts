import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string = '';
  constructor(private cookieService: CookieService) {
    this.token = this.cookieService.get('token');
  }

  /* Get Payload => and add in Session Storage */
  public saveSessionStorage(): any {
    if (this.token) {
      try {
        const payload: any = jwtDecode(this.token);
        sessionStorage.setItem('payload', JSON.stringify(payload));
      } catch (error) {
        return false;
      }
    } else {
      return null;
    }
  }

  /* Get SessionStorage Payload */
  public getDecodedToken() {
    const payload = sessionStorage.getItem('payload');
    return payload ? JSON.parse(payload) : null;
  }

  /* Remove SessionStorage => Payload */
  public clearPayloadFromSession() {
    this.cookieService.delete('token');
    sessionStorage.removeItem('payload');
  }


}
