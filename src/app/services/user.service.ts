import { Injectable } from '@angular/core';
import { AuthService } from './auth.service'; 
import { loginUser } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public userPayload: loginUser;

  constructor(private authService: AuthService) {
    this.userPayload = this.authService.getDecodedToken();
  }
}
