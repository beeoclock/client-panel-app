import {Route} from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/sign-in')
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./pages/sign-up')
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
