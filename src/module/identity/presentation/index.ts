import {Route} from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./page/sign-in')
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./page/sign-up')
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./page/reset-password')
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./page/forgot-password')
  },
  {
    path: 'confirm-email',
    loadComponent: () => import('./page/confirm-email')
  },
  {
    path: 'corridor',
    loadComponent: () => import('./page/corridor')
  },
] as Route[];
