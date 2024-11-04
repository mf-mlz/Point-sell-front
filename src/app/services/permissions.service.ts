import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

/* Set and Get Permissions Modules */
export class PermissionsService {
  private value: any;

  setPermissions(newValue: any) {
    const data = JSON.parse(newValue);
    this.value = data;
  }

  getPermissions() {
    return this.value;
  }
}
