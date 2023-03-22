import {Route} from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/login')
  },
  {
    path: 'registration',
    loadComponent: () => import('./pages/registration')
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/reset-password')
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password')
  },
  {
    path: 'confirm-email',
    loadComponent: () => import('./pages/confirm-email')
  },
] as Route[];
