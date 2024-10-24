import { Injectable } from '@angular/core';
import { INavData } from '@coreui/angular';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { ApiServicePermissions } from 'src/app/services/api.service.permissions';
import { ModulesPermissions } from 'src/app/models/interfaces';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  public navItems: INavData[] = [];
  public navItemsPermissions: INavData[] = [];

  constructor(
    private authService: AuthService,
    private apiServicePermissions: ApiServicePermissions
  ) {
    this.navItems = [];
  }

  /* All NavItems */
  allItems(): INavData[] {
    const navItems: INavData[] = [
      {
        name: 'Dashboard',
        url: '/dashboard',
        iconComponent: { name: 'cil-speedometer' },
        badge: {
          color: 'info',
          text: 'NEW',
        },
      },
      {
        title: true,
        name: 'Módulos',
      },
      {
        name: 'Productos',
        url: '/modules/products',
        iconComponent: { name: 'cil-list' },
      },
      {
        name: 'Ventas',
        url: '/modules/sales',
        iconComponent: { name: 'cil-calculator' },
        children: [
          {
            name: 'Ver Ventas',
            url: '/modules/sales',
            icon: 'nav-icon-bullet',
          },
          {
            name: 'Añadir Venta',
            url: '/modules/addSale',
            icon: 'nav-icon-bullet',
          },
        ],
      },
      {
        name: 'Empleados',
        url: '/modules/employees',
        iconComponent: { name: 'cil-list' },
      },
      {
        name: 'Permisos',
        url: '/modules/permissions',
        iconComponent: { name: 'cil-list' },
      },
      {
        name: 'Pages',
        url: '/login',
        iconComponent: { name: 'cil-star' },
        children: [
          {
            name: 'Login',
            url: '/login',
            icon: 'nav-icon-bullet',
          },
          {
            name: 'Register',
            url: '/register',
            icon: 'nav-icon-bullet',
          },
          {
            name: 'Error 404',
            url: '/404',
            icon: 'nav-icon-bullet',
          },
          {
            name: 'Error 500',
            url: '/500',
            icon: 'nav-icon-bullet',
          },
        ],
      },
    ];

    return navItems;
  }

  /* Generate Modules By Permissions */
  generateModule(): Observable<INavData[]> {
    /* Nav items */
    this.navItems = this.allItems();

    return new Observable((observer) => {
      this.apiServicePermissions
        .getModuleAccessByRole()
        .pipe(
          map((response) => {
            if (response.status) {
              /* Filter Modules */
              for (let i = 0; i < this.navItems.length; i++) {
                const elementModule = this.navItems[i];
                const filterModules = response.data.filter(
                  (module: ModulesPermissions) =>
                    module.module === elementModule.name
                );

                if (filterModules.length > 0) {
                  this.navItemsPermissions.push(elementModule);
                }
              }

              /* Filter Children */
              for (let j = 0; j < this.navItemsPermissions.length; j++) {
                let children = this.navItemsPermissions[j].children;

                if (children) {
                  const permissionModules = response.data.map(
                    (permission: ModulesPermissions) => permission.module
                  );

                  const filteredChildren = children.filter((child) =>
                    permissionModules.includes(child.name)
                  );

                  this.navItemsPermissions[j].children = filteredChildren;
                }
              }

              /* Return Modules Permissions */
              this.navItems = this.navItemsPermissions;

              /* Filter Unique Items */
              this.navItems = this.navItems.filter(
                (item, index, self) =>
                  index === self.findIndex((i) => i.name === item.name)
              );

              observer.next(this.navItems);
              observer.complete();
            } else {
              observer.next([]);
              observer.complete();
            }
          }),
          catchError((error) => {
            observer.error(error);
            return of([]);
          })
        )
        .subscribe();
    });
  }
}
