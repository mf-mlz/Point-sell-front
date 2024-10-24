import { Routes } from '@angular/router';
import { PermissiosGuard } from '../../guards/permissions.guard';
import { AuthGuard } from '../../guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent),
    data: {
      title: $localize`Dashboard`
    },
    canActivate: [AuthGuard, PermissiosGuard]
  }
];

