import { Injectable } from '@angular/core';
import { INavData } from '@coreui/angular';
import { UserService } from 'src/app/services/user.service';
import { ModulesService } from 'src/app/services/modules.service';
import { ModulesPermissions } from 'src/app/models/interfaces';
import { map, switchMap } from 'rxjs/operators';
import { ApiServiceModules } from 'src/app/services/api.service.modules';
import { lastValueFrom, from, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  public navItems: INavData[] = [];
  public navItemsPermissions: INavData[] = [];
  
  constructor(
    private modulesService: ModulesService,
    private apiServiceModules: ApiServiceModules,
    private userService: UserService
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

        return from(this.modulesService.getModules()).pipe(
          map((dataUserLogged) => {
            
            const modules = dataUserLogged;

            this.navItemsPermissions = this.navItems.filter((elementModule) =>
              modules.some(
                (module: ModulesPermissions) =>
                  module.module === elementModule.name
              )
            );

            this.navItemsPermissions.forEach((module) => {
              if (module.children) {
                const permissionModules = modules.map(
                  (permission: ModulesPermissions) => permission.module
                );

                module.children = module.children.filter((child) =>
                  permissionModules.includes(child.name)
                );
              }
            });

            this.navItems = Array.from(
              new Set(this.navItemsPermissions.map((item) => item.name))
            )
              .map((name) =>
                this.navItemsPermissions.find((item) => item.name === name)
              )
              .filter((item): item is INavData => item !== undefined);

            return this.navItems;
          })
        );
      })
    );
  }
}
