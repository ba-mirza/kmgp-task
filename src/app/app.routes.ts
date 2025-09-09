import { Routes } from '@angular/router';
import {authGuard} from './core/auth/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/orders', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/orders/orders').then(m => m.Orders),
  },
  {
    path: 'orders/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/order-edit/order-edit').then(m => m.OrderEdit)
  },
  {
    path: '**',
    redirectTo: '/orders',
  }
];
