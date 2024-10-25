import { Injectable } from '@angular/core';
import { INavData } from '@coreui/angular';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { ApiServicePermissions } from 'src/app/services/api.service.permissions';
import { ModulesPermissions } from 'src/app/models/interfaces';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { ApiServiceModules } from 'src/app/services/api.service.modules';
import { lastValueFrom, from, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  public navItems: INavData[] = [];
  public navItemsPermissions: INavData[] = [];
  private secretKey = environment.secret_key;

  constructor(
    private apiServicePermissions: ApiServicePermissions,
    private apiServiceModules: ApiServiceModules
  ) {
    this.navItems = [];
  }

  /* All NavItems => BD */
  async allItems(): Promise<INavData[]> {
    const response = lastValueFrom(this.apiServiceModules.all()).then(
      (response) => response.modules || []
    );
    return response;
  }

  /* Generate Modules By Permissions */
  generateModule(): Observable<INavData[]> {
    return from(this.allItems()).pipe(
      switchMap((items) => {
        this.navItems = items;
        return this.apiServicePermissions.getModuleAccessByRole().pipe(
          map((response) => {
            if (response.status) {
              const decryptedData = CryptoJS.AES.decrypt(
                response.data,
                this.secretKey
              );
              const decryptedModules = JSON.parse(
                decryptedData.toString(CryptoJS.enc.Utf8)
              );

              /* Modules => Permissions */
              this.navItemsPermissions = this.navItems.filter((elementModule) =>
                decryptedModules.some(
                  (module: ModulesPermissions) =>
                    module.module === elementModule.name
                )
              );

              /* SubModules */
              this.navItemsPermissions.forEach((module) => {
                if (module.children) {
                  const permissionModules = decryptedModules.map(
                    (permission: ModulesPermissions) => permission.module
                  );

                  module.children = module.children.filter((child) =>
                    permissionModules.includes(child.name)
                  );
                }
              });

              /* Filter Unique Modules */
              this.navItems = Array.from(
                new Set(this.navItemsPermissions.map((item) => item.name))
              )
                .map((name) =>
                  this.navItemsPermissions.find((item) => item.name === name)
                )
                .filter((item): item is INavData => item !== undefined);

              return this.navItems;
            } else {
              return [];
            }
          }),
          catchError((error) => {
            console.error(error);
            return of([]);
          })
        );
      })
    );
  }
}
