import { Routes } from '@angular/router';

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
        loadComponent: () => import('./sales/sales.component').then(m => m.SalesComponent),
        data: {
          title: 'Ventas'
        }
      }
    ]
  }
];

