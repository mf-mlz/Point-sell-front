import { Routes } from '@angular/router';
import { PermissiosGuard } from '../../guards/permissions.guard';
import { AuthGuard } from '../../guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Modules'
    },
    canActivateChild: [AuthGuard, PermissiosGuard],
    children: [
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
      },
      {
        path: 'products',
        loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent),
        data: {
          title: 'Productos'
        }
      },
      {
        path: 'sales',
        loadComponent: () => import('./sales/view/sales.component').then(m => m.SalesComponent),
        data: {
          title: 'Ver Ventas'
        }
      },
      {
        path: 'sales/:idSale',
        loadComponent: () => import('./sales/view/sales.component').then(m => m.SalesComponent),
        data: {
          title: 'Ver Ventas'
        }
      },
      {
        path: 'addSale',
        loadComponent: () => import('./sales/add/add-sales.component').then(m => m.AddSalesComponent),
        data: {
          title: 'Añadir Venta'
        }
      },
      {
        path: 'employees',
        loadComponent: () => import('./employees/employees.component').then(m => m.EmployeesComponent),
        data: {
          title: 'Empleados'
        }
      },
      {
        path: 'modules',
        loadComponent: () => import('./modules/modules.component').then(m => m.ModulesComponent),
        data: {
          title: 'Modulos'
        }
      },
      {
        path: 'permissions',
        loadComponent: () => import('./permissions/permissions.component').then(m => m.PermissionsComponent),
        data: {
          title: 'Permisos'
        }
      },
      {
        path: 'clients',
        loadComponent: () => import('./clients/clients.component').then(m => m.ClientsComponent),
        data: {
          title: 'Clientes'
        }
      }
    ]
  }
];

