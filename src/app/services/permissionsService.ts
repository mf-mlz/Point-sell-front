import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})

/* Set and Get Permissions Modules */
export class PermissionsService {
  private value: any;

  setPermissions(newValue: any) {
    const decryptedBytes = CryptoJS.AES.decrypt(newValue, environment.secret_key);
    const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const data = JSON.parse(decryptedData);
    this.value = data;
  }

  getPermissions() {
    return this.value;
  }
}
