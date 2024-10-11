import { Routes } from '@angular/router';
import { ModuleGuard } from '../../guards/module/module.guard';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Modules'
    },
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
          title: 'Ventas'
        }
      },
      {
        path: 'sales/:idSale',
        loadComponent: () => import('./sales/view/sales.component').then(m => m.SalesComponent),
        data: {
          title: 'Ventas'
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
        canActivate: [ModuleGuard],
        data: {
          title: 'Empleados'
        }
      }
    ]
  }
];

