import {Route} from '@angular/router';

export default [
  {
    path: 'not-found',
    loadComponent: () => import('./pages/not-found')
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard')
  }
] as Route[];
