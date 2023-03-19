import {Route} from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/login/page')
  },
  {
    path: 'registration',
    loadComponent: () => import('./pages/registration/page')
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/reset-password/page')
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/page')
  },
  {
    path: 'confirm-email',
    loadComponent: () => import('./pages/confirm-email/page')
  },
] as Route[];
