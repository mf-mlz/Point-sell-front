import { Injectable } from '@angular/core';
import { AuthService } from './auth.service'; 

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public userPayload: any;

  constructor(private authService: AuthService) {
    this.userPayload = this.authService.getDecodedToken();
  }
}
